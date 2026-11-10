export type QueueEntry<T=unknown>={id:string;kind:string;createdAt:string;attempts:number;status:'pending'|'syncing'|'failed';payload:T;error?:string}
const DB='ranna-erp-offline',STORE='outbox',VERSION=1

const openDb=()=>new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open(DB,VERSION);request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:'id'});store.createIndex('status','status');store.createIndex('createdAt','createdAt')}};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})
const transaction=async<T>(mode:IDBTransactionMode,work:(store:IDBObjectStore,ok:(x:T)=>void,fail:(e:unknown)=>void)=>void)=>{const db=await openDb();return new Promise<T>((resolve,reject)=>{const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);work(store,resolve,reject);tx.oncomplete=()=>db.close();tx.onerror=()=>reject(tx.error)})}
export const enqueue=async<T>(kind:string,payload:T,id=crypto.randomUUID())=>transaction<QueueEntry<T>>('readwrite',(s,ok,fail)=>{const entry:QueueEntry<T>={id,kind,payload,createdAt:new Date().toISOString(),attempts:0,status:'pending'};const r=s.add(entry);r.onsuccess=()=>ok(entry);r.onerror=()=>fail(r.error)})
export const listQueue=()=>transaction<QueueEntry[]>('readonly',(s,ok,fail)=>{const r=s.getAll();r.onsuccess=()=>ok(r.result.sort((a,b)=>a.createdAt.localeCompare(b.createdAt)));r.onerror=()=>fail(r.error)})
export const removeQueued=(id:string)=>transaction<void>('readwrite',(s,ok,fail)=>{const r=s.delete(id);r.onsuccess=()=>ok();r.onerror=()=>fail(r.error)})
export const updateQueued=(entry:QueueEntry)=>transaction<QueueEntry>('readwrite',(s,ok,fail)=>{const r=s.put(entry);r.onsuccess=()=>ok(entry);r.onerror=()=>fail(r.error)})

export async function syncQueue(send:(entry:QueueEntry)=>Promise<void>){
  const entries=await listQueue(),results:{id:string;ok:boolean;error?:string}[]=[]
  for(const entry of entries){
    try{const active={...entry,status:'syncing' as const,attempts:entry.attempts+1};await updateQueued(active);await send(active);await removeQueued(entry.id);results.push({id:entry.id,ok:true})}
    catch(error){const message=error instanceof Error?error.message:String(error);await updateQueued({...entry,status:'failed',attempts:entry.attempts+1,error:message});results.push({id:entry.id,ok:false,error:message})}
  }
  return results
}

export const registerOfflineWorker=async()=>{
  if(!('serviceWorker' in navigator))return null
  if(import.meta.env.DEV){
    const registrations=await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map(registration=>registration.unregister()))
    if('caches' in window){
      const keys=await caches.keys()
      await Promise.all(keys.filter(key=>key.startsWith('ranna-erp-')).map(key=>caches.delete(key)))
    }
    if(navigator.serviceWorker.controller&&!sessionStorage.getItem('ranna-sw-reset')){
      sessionStorage.setItem('ranna-sw-reset','1')
      location.reload()
    }
    return null
  }
  return navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
}
