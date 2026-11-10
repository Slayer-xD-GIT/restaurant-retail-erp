import { BDT, inclusiveTax, taka } from './engine'

export type Product = {
  id: string; name: string; category: string; price: number; taxRate: number;
  sdRate: number; cost: number; stock: number; target: number; sold: number;
  tint: string; emoji: string; image: string; ingredients: string[];
}

export type CartLine = Product & { quantity: number }

export type Approval = {
  id: string; type: string; title: string; requester: string; outlet: string;
  amount: number; age: string; priority: 'High' | 'Normal'; status: 'Pending' | 'Approved' | 'Rejected';
}

export type SaleRecord = {
  id: string; time: string; type: string; items: number; gross: number; net: number;
  tax: number; cogs: number; tender: string; status: 'Posted'|'Queued';
  subtotal?: number; discount?: number; vat?: number; sd?: number; customer?: string;
  customerPhone?: string; table?: string; guests?: number; note?: string;
  payments?: { method:string; amount:number; reference?:string }[]; invoiceNo?: string;
  channel?: string; deliveryAddress?: string; loyaltyPoints?: number;
  lines?: { id:string; name:string; quantity:number; price:number; gross:number; net:number; vat:number; sd:number; cost:number }[];
}

export type StockBatch = {
  item: string; code: string; location: string; batch: string; quantity: number; unit: string;
  expiry: string; daysLeft: number; status: 'Critical'|'Near expiry'|'Healthy'; value: number;
}

export const products: Product[] = [
  { id:'P-101', name:'Classic Chicken Burger', category:'Burgers', price:300, taxRate:.15, sdRate:.05, cost:96, stock:64, target:706, sold:412, tint:'#ffd8a8', emoji:'🍔', image:'/images/menu/classic-chicken-burger.jpg', ingredients:['Chicken patty · 1 pc','Brioche bun · 1 pc','Burger sauce · 28 g'] },
  { id:'P-102', name:'Smoky Beef Burger', category:'Burgers', price:420, taxRate:.15, sdRate:.05, cost:146, stock:41, target:471, sold:308, tint:'#e9c6aa', emoji:'🥩', image:'/images/menu/smoky-beef-burger.jpg', ingredients:['Beef patty · 1 pc','Brioche bun · 1 pc','Cheese slice · 1 pc'] },
  { id:'P-103', name:'Crispy Chicken Rice', category:'Rice bowls', price:360, taxRate:.15, sdRate:0, cost:118, stock:87, target:420, sold:264, tint:'#ffe69c', emoji:'🍛', image:'/images/menu/crispy-chicken-rice.jpg', ingredients:['Rice · 220 g','Chicken fillet · 140 g','House gravy · 60 g'] },
  { id:'P-104', name:'Firecracker Wings', category:'Sides', price:280, taxRate:.15, sdRate:0, cost:91, stock:29, target:360, sold:197, tint:'#ffcab0', emoji:'🍗', image:'/images/menu/firecracker-wings.jpg', ingredients:['Chicken wings · 6 pc','Firecracker glaze · 45 g'] },
  { id:'P-105', name:'Loaded Fries', category:'Sides', price:240, taxRate:.15, sdRate:0, cost:68, stock:52, target:330, sold:226, tint:'#fff0ad', emoji:'🍟', image:'/images/menu/loaded-fries.jpg', ingredients:['Potato fries · 180 g','Cheese sauce · 50 g'] },
  { id:'P-106', name:'Mango Mint Cooler', category:'Drinks', price:190, taxRate:.15, sdRate:0, cost:42, stock:73, target:510, sold:344, tint:'#c7f0c2', emoji:'🥤', image:'/images/menu/mango-mint-cooler.jpg', ingredients:['Mango pulp · 90 ml','Mint syrup · 25 ml','Soda · 180 ml'] },
  { id:'P-107', name:'Chocolate Lava Cake', category:'Desserts', price:260, taxRate:.15, sdRate:0, cost:79, stock:18, target:240, sold:164, tint:'#d7c0b0', emoji:'🍰', image:'/images/menu/chocolate-lava-cake.jpg', ingredients:['Lava cake · 1 pc','Vanilla cream · 30 g'] },
  { id:'P-108', name:'Family Feast Combo', category:'Combos', price:1290, taxRate:.15, sdRate:.05, cost:438, stock:16, target:120, sold:74, tint:'#dbcdf5', emoji:'🍽️', image:'/images/menu/family-feast-combo.jpg', ingredients:['Chicken burger · 2 pc','Loaded fries · 2 pc','Cooler · 4 pc'] },
]

export const approvalsSeed: Approval[] = [
  { id:'PO-240118', type:'Purchase order', title:'Fresh Foods Ltd · cooking oil & dairy', requester:'Nabila Rahman', outlet:'Dhanmondi', amount:184500, age:'18 min', priority:'High', status:'Pending' },
  { id:'GRN-240067', type:'Price variance', title:'Prime Poultry · +6.2% invoice variance', requester:'Sabbir Hasan', outlet:'Central Warehouse', amount:13800, age:'42 min', priority:'High', status:'Pending' },
  { id:'REQ-240391', type:'Stock requisition', title:'Weekend replenishment · 14 lines', requester:'Arif Chowdhury', outlet:'Gulshan', amount:78200, age:'1 hr', priority:'Normal', status:'Pending' },
  { id:'EXP-240086', type:'Expense claim', title:'Emergency chiller repair', requester:'Maliha Noor', outlet:'Banani', amount:12500, age:'3 hr', priority:'Normal', status:'Pending' },
]

export const salesSeed: SaleRecord[] = [
  {id:'DH-1108-486',time:'22:14',type:'Takeaway',items:3,gross:3450,net:2914.29,tax:535.71,cogs:1104,tender:'Card',status:'Posted'},
  {id:'DH-1108-485',time:'22:08',type:'Dine-in',items:2,gross:680,net:580.75,tax:99.25,cogs:214,tender:'Cash',status:'Posted'},
  {id:'DH-1108-484',time:'21:57',type:'Delivery',items:5,gross:2140,net:1817.81,tax:322.19,cogs:692,tender:'Mobile wallet',status:'Posted'},
  {id:'DH-1108-483',time:'21:46',type:'Takeaway',items:1,gross:300,net:248.45,tax:51.55,cogs:96,tender:'Cash',status:'Posted'},
]

export const stockSeed: StockBatch[] = [
  {item:'Chicken patty',code:'RM-001',location:'Central Warehouse',batch:'CP-241101',quantity:842,unit:'pcs',expiry:'12 Nov 2026',daysLeft:4,status:'Critical',value:50520},
  {item:'Brioche bun',code:'RM-014',location:'Dhanmondi',batch:'BB-241106',quantity:128,unit:'pcs',expiry:'10 Nov 2026',daysLeft:2,status:'Critical',value:2560},
  {item:'Burger sauce',code:'PREP-04',location:'Dhanmondi',batch:'BS-241107',quantity:18.4,unit:'kg',expiry:'9 Nov 2026',daysLeft:1,status:'Critical',value:7360},
  {item:'Cheese slice',code:'RM-021',location:'Dhanmondi',batch:'CS-241030',quantity:236,unit:'pcs',expiry:'23 Nov 2026',daysLeft:15,status:'Near expiry',value:2832},
  {item:'Mango pulp',code:'RM-038',location:'Dhanmondi',batch:'MP-241028',quantity:42,unit:'L',expiry:'8 Dec 2026',daysLeft:30,status:'Healthy',value:12600},
  {item:'Potato fries',code:'RM-017',location:'Dhanmondi',batch:'PF-241105',quantity:76,unit:'kg',expiry:'5 Feb 2027',daysLeft:89,status:'Healthy',value:12920},
  {item:'Beef patty',code:'RM-002',location:'Gulshan',batch:'BP-241102',quantity:310,unit:'pcs',expiry:'16 Nov 2026',daysLeft:8,status:'Near expiry',value:35650},
  {item:'Cooking oil',code:'RM-008',location:'Central Warehouse',batch:'CO-241104',quantity:680,unit:'L',expiry:'1 May 2027',daysLeft:174,status:'Healthy',value:136000},
  {item:'Chicken fillet',code:'RM-004',location:'Banani',batch:'CF-241105',quantity:94,unit:'kg',expiry:'18 Nov 2026',daysLeft:10,status:'Near expiry',value:31020},
]

export const fmt = (n:number) => new Intl.NumberFormat('en-BD', { style:'currency', currency:'BDT', maximumFractionDigits:0 }).format(n).replace('BDT','৳')
export const money = (n:number) => new Intl.NumberFormat('en-BD', { maximumFractionDigits:2 }).format(n)
export const netOfTax = (gross:number, vat:number, sd:number) => gross / (1 + vat) / (1 + sd)

export function cartTotals(lines:CartLine[]) {
  return lines.reduce((a,l) => {
    const gross = l.price * l.quantity
    const tax = inclusiveTax(BDT(gross),Math.round(l.taxRate*10000),Math.round(l.sdRate*10000))
    return { gross:a.gross+taka(tax.gross), net:a.net+taka(tax.net), sd:a.sd+taka(tax.sd), vat:a.vat+taka(tax.vat), cogs:a.cogs+taka(BDT(l.cost*l.quantity)) }
  }, {gross:0, net:0, sd:0, vat:0, cogs:0})
}

