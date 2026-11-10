export type Money = bigint // poisha, never floating point
export const BDT = (taka:number):Money => BigInt(Math.round(taka*100))
export const taka = (value:Money) => Number(value)/100
export const roundDiv = (n:bigint,d:bigint) => (n+d/2n)/d

export function inclusiveTax(gross:Money,vatBps:number,sdBps:number){
  const afterSd=roundDiv(gross*10000n,BigInt(10000+sdBps))
  const net=roundDiv(afterSd*10000n,BigInt(10000+vatBps))
  const sd=roundDiv(net*BigInt(sdBps),10000n)
  const vat=gross-net-sd
  return {gross,net,sd,vat}
}

export type JournalLine={account:string;debit:Money;credit:Money;outlet:string}
export function validateJournal(lines:JournalLine[]){
  if(lines.length<2) return {valid:false,error:'At least two lines are required'}
  if(lines.some(l=>l.debit<0n||l.credit<0n||(l.debit>0n&&l.credit>0n))) return {valid:false,error:'Each line must be one-sided and non-negative'}
  const debit=lines.reduce((n,l)=>n+l.debit,0n),credit=lines.reduce((n,l)=>n+l.credit,0n)
  return debit===credit&&debit>0n?{valid:true,debit,credit}:{valid:false,error:'Total debit must equal total credit',debit,credit}
}

export type Batch={id:string;itemId:string;locationId:string;qtyMilli:number;unitCost:Money;expiry:string}
export function consumeFefo(source:Batch[],itemId:string,locationId:string,qtyMilli:number,onDate:string){
  if(!Number.isInteger(qtyMilli)||qtyMilli<=0) throw new Error('Quantity must be a positive base-unit integer')
  const batches=source.filter(b=>b.itemId===itemId&&b.locationId===locationId&&b.qtyMilli>0&&b.expiry>=onDate).sort((a,b)=>a.expiry.localeCompare(b.expiry)||a.id.localeCompare(b.id))
  let remaining=qtyMilli,cost=0n;const allocations:{batchId:string;qtyMilli:number;cost:Money}[]=[]
  for(const b of batches){if(!remaining)break;const take=Math.min(remaining,b.qtyMilli),line=roundDiv(b.unitCost*BigInt(take),1000n);allocations.push({batchId:b.id,qtyMilli:take,cost:line});cost+=line;remaining-=take}
  if(remaining) throw new Error(`Insufficient non-expired stock: short ${remaining/1000}`)
  const used=new Map(allocations.map(x=>[x.batchId,x.qtyMilli]))
  return {allocations,cost,batches:source.map(b=>({...b,qtyMilli:b.qtyMilli-(used.get(b.id)||0)}))}
}

export function weightedAverage(openingQtyMilli:number,openingValue:Money,receiptQtyMilli:number,receiptValue:Money){
  const qty=openingQtyMilli+receiptQtyMilli
  if(qty<=0) return {qtyMilli:0,value:0n,unitCost:0n}
  const value=openingValue+receiptValue
  return {qtyMilli:qty,value,unitCost:roundDiv(value*1000n,BigInt(qty))}
}

export type VendorRate={vendorId:string;itemId:string;rate:Money;validFrom:string;validTo:string;status:'Active'|'Waiting'|'Rejected'}
export function applicableVendorRate(rates:VendorRate[],vendorId:string,itemId:string,poDate:string){
  return rates.filter(r=>r.vendorId===vendorId&&r.itemId===itemId&&r.status==='Active'&&r.validFrom<=poDate&&r.validTo>=poDate).sort((a,b)=>b.validFrom.localeCompare(a.validFrom))[0]||null
}
export function grnPriceControl(poRate:Money,invoiceRate:Money,toleranceBps=0){
  const ceiling=poRate+roundDiv(poRate*BigInt(toleranceBps),10000n),variance=invoiceRate-poRate
  return invoiceRate<=ceiling?{state:'Allowed' as const,variance}:{state:'Blocked' as const,variance,varianceBps:Number(roundDiv(variance*10000n,poRate))}
}

export type ApprovalInput={requesterId:string;approverId:string;amount:Money;limit:Money;expectedVersion:number;actualVersion:number;active:boolean}
export function authorizeApproval(x:ApprovalInput){
  if(!x.active)return {ok:false,reason:'Approver is inactive'}
  if(x.requesterId===x.approverId)return {ok:false,reason:'Self-approval is prohibited'}
  if(x.amount>x.limit)return {ok:false,reason:'Amount exceeds approval authority'}
  if(x.expectedVersion!==x.actualVersion)return {ok:false,reason:'Approval was already changed'}
  return {ok:true,version:x.actualVersion+1}
}

export type RecipeRow={row:number;product:string;type:'Finished'|'Preparation'|'Raw'|string;ingredient:string;qty:number;uom:string;shelfLife?:number}
export function validateRecipeRows(rows:RecipeRow[],known:Record<string,string>){
  const errors:{row:number;field:string;message:string}[]=[],products=new Map<string,RecipeRow>()
  for(const r of rows){
    if(!r.product.trim())errors.push({row:r.row,field:'product',message:'Product is required'})
    if(!['Finished','Preparation','Raw'].includes(r.type))errors.push({row:r.row,field:'type',message:'Type must be Finished, Preparation or Raw'})
    if((r.type==='Finished'||r.type==='Preparation')&&(!Number.isInteger(r.shelfLife)||Number(r.shelfLife)<=0))errors.push({row:r.row,field:'shelfLife',message:'Positive whole-day shelf life is required'})
    if(!known[r.ingredient])errors.push({row:r.row,field:'ingredient',message:'Unknown ingredient'})
    else if(known[r.ingredient]!==r.uom)errors.push({row:r.row,field:'uom',message:`Expected ${known[r.ingredient]}`})
    const duplicate=`${r.product}|${r.ingredient}`;if(products.has(duplicate))errors.push({row:r.row,field:'ingredient',message:'Duplicate recipe line'});products.set(duplicate,r)
  }
  const graph=new Map<string,string[]>();for(const r of rows)graph.set(r.product,[...(graph.get(r.product)||[]),r.ingredient])
  const visiting=new Set<string>(),done=new Set<string>();let circular=false
  const walk=(n:string):void=>{if(visiting.has(n)){circular=true;return}if(done.has(n))return;visiting.add(n);for(const c of graph.get(n)||[])if(graph.has(c))walk(c);visiting.delete(n);done.add(n)}
  for(const n of graph.keys())walk(n);if(circular)errors.push({row:0,field:'recipe',message:'Circular recipe detected'})
  return {valid:errors.length===0,errors}
}

export function stockCover(qty:number,consumption:number,periodDays:number,leadDays:number,daysToExpiry:number){
  const daily=consumption/periodDays,days=daily>0?qty/daily:Infinity
  return {daily,days,months:days/30,reorder:days<leadDays,expiryRisk:days>daysToExpiry}
}

export function salesTargetPlan(monthlyGross:number,openDays:number,hourWeights:number[],items:{id:string;price:number;mix:number}[],itemsPerOrder:number){
  if(monthlyGross<=0||openDays<=0||!hourWeights.length)throw new Error('Positive target, open days and hour weights are required')
  const mixTotal=items.reduce((n,x)=>n+x.mix,0);if(Math.abs(mixTotal-1)>.0001)throw new Error('Item mix must total 100%')
  const avgPrice=items.reduce((n,x)=>n+x.price*x.mix,0),dailyGross=monthlyGross/openDays,itemsPerDay=dailyGross/avgPrice,totalWeight=hourWeights.reduce((n,x)=>n+x,0)
  const hours=hourWeights.map((weight,index)=>({index,share:weight/totalWeight,gross:dailyGross*weight/totalWeight,units:itemsPerDay*weight/totalWeight,orders:itemsPerDay*weight/totalWeight/itemsPerOrder}))
  return {dailyGross,avgPrice,itemsPerDay,hours,items:items.map(x=>({...x,monthlyUnits:itemsPerDay*x.mix*openDays,dailyUnits:itemsPerDay*x.mix}))}
}

export function campaignProjection(units:number,price:Money,discountBps:number,foodCost:Money,materials:Money){
  const gross=price*BigInt(units),discount=roundDiv(gross*BigInt(discountBps),10000n),netSales=gross-discount,totalFood=foodCost*BigInt(units),contribution=netSales-totalFood-materials
  return {gross,discount,netSales,totalFood,materials,contribution,cost:discount+materials}
}

export function straightLineDepreciation(cost:Money,salvage:Money,usefulMonths:number,monthsHeld:number){
  if(cost<salvage||usefulMonths<=0)throw new Error('Invalid depreciation inputs')
  const monthly=roundDiv(cost-salvage,BigInt(usefulMonths)),months=Math.min(Math.max(monthsHeld,0),usefulMonths),accumulated=monthly*BigInt(months)
  return {monthly,accumulated,netBookValue:cost-accumulated}
}

export class IdempotencyStore<T>{private results=new Map<string,T>();execute(key:string,operation:()=>T){if(!key)throw new Error('Idempotency key is required');if(this.results.has(key))return {duplicate:true,result:this.results.get(key)!};const result=operation();this.results.set(key,result);return {duplicate:false,result}}}
