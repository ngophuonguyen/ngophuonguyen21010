import {useCallback,useEffect,useRef,useState} from 'react';
import type {User} from '@supabase/supabase-js';
import {supabase} from './supabase';
import {itemKey,legacyItems,readItems,selected,validItem,type Item,type Items,type Category} from './progress';
const key=(uid:string)=>`deutsch-v2:${uid}`;
const queueKey=(uid:string)=>`${key(uid)}:pending`;
function storageRead(k:string) {try{return localStorage.getItem(k);}catch{return null;}}
function storageWrite(k:string,data:unknown) {localStorage.setItem(k,JSON.stringify(data));}
export function useLearning(){
 const [user,setUser]=useState<User|null>(null),[authReady,setAuthReady]=useState(!supabase),[loading,setLoading]=useState(true),[items,setItems]=useState<Items>({}),[status,setStatus]=useState('Đang tải tiến độ…');
 const [error,setError]=useState('');
 const state=useRef<Items>({}),outbox=useRef<Items>({}),owner=useRef(''),generation=useRef(0),saving=useRef(false),loaded=useRef(false);
 useEffect(()=>{
  if(!supabase)return;
  let active=true;
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(active){setUser(session?.user??null);setAuthReady(true);}});
  supabase.auth.getSession().then(({data,error})=>{if(active){if(error)setError(error.message);setUser(data.session?.user??null);setAuthReady(true);}});
  return()=>{active=false;subscription.unsubscribe();};
 },[]);
 const flush=useCallback(async()=>{
  if(!supabase || !user || owner.current!==user.id || !loaded.current || saving.current)return;
  const uid=user.id,g= generation.current;
  const pending={...outbox.current};
  if(!Object.keys(pending).length)return;
  if(!navigator.onLine){setStatus('Đang ngoại tuyến · sẽ đồng bộ khi có mạng');return;}
  saving.current=true;setStatus('Đang đồng bộ…');
  try {
   const {error}=await supabase.from('learning_items').upsert(Object.values(pending).map(i=>({...i,user_id:uid})),{onConflict:'user_id,category,item_id'});
   if(g!==generation.current)return;
   if(error)throw error;
   for(const [k,v] of Object.entries(pending)) if(outbox.current[k]===v)delete outbox.current[k];
   storageWrite(queueKey(uid),outbox.current);
   setStatus(Object.keys(outbox.current).length?'Còn thay đổi chờ đồng bộ':'Đã lưu vào tài khoản');setError('');
  }catch(e){if(g===generation.current){setStatus('Đã giữ trên thiết bị · chưa đồng bộ');setError(e instanceof Error?e.message:'Không thể đồng bộ');}}
  finally{saving.current=false;}
 },[user]);
 useEffect(()=>{
  if(!authReady)return;
  const g=++generation.current,uid=user?.id??'guest';owner.current=uid;loaded.current=false;saving.current=false;setLoading(true);setError('');
  let cache=readItems(storageRead(key(uid)));
  if(uid==='guest'&&!Object.keys(cache).length){try{cache=legacyItems(JSON.parse(storageRead('uyen-days')||'[]'),JSON.parse(storageRead('uyen-words')||'[]'));}catch{}}
  state.current=cache;outbox.current=readItems(storageRead(queueKey(uid)));setItems(cache);
  const load=async()=>{
   if(user&&supabase){
    const {data,error}=await supabase.from('learning_items').select('category,item_id,value').eq('user_id',user.id);
    if(g!==generation.current)return;
    if(error){setError(error.message);setStatus('Chưa tải được dữ liệu tài khoản · thử tải lại');setLoading(false);return;}
    const remote:Items={};for(const i of data??[])if(validItem(i))remote[itemKey(i)]=i;
    // Only this account's pending edits override the server snapshot.
    cache={...remote,...outbox.current};
   }
   if(g!==generation.current)return;
   state.current=cache;setItems(cache);try{storageWrite(key(uid),cache);}catch{setError('Trình duyệt không cho phép lưu cục bộ.');}
   loaded.current=true;setLoading(false);setStatus(user?'Đã tải dữ liệu tài khoản':'Chế độ khách · lưu trên thiết bị');
  };
  void load().catch(e=>{if(g===generation.current){setLoading(false);setError(String(e));setStatus('Không thể tải tiến độ tài khoản');}});
  return()=>{generation.current++;loaded.current=false;};
 },[authReady,user?.id]);
 useEffect(()=>{const t=window.setInterval(()=>void flush(),5000);const online=()=>void flush();window.addEventListener('online',online);return()=>{clearInterval(t);window.removeEventListener('online',online);};},[flush]);
 function write(updates:Item[]){
  if(!loaded.current)return;
  const next={...state.current};for(const i of updates){if(!validItem(i))continue;next[itemKey(i)]=i;if(user)outbox.current[itemKey(i)]=i;}
  state.current=next;setItems(next);
  try{storageWrite(key(owner.current),next);if(user)storageWrite(queueKey(owner.current),outbox.current);setStatus(user?'Đã lưu trên thiết bị · chờ đồng bộ':'Đã lưu trên thiết bị');}catch{setError('Bộ nhớ trình duyệt đã đầy hoặc bị chặn. Giữ trang mở để đồng bộ.');}
 }
 function setNumbers(category:'day'|'word',value:number[]|((old:number[])=>number[])){
  const old=selected(state.current,category).map(Number);const next=typeof value==='function'?value(old):value;
  write([...new Set([...old,...next])].filter(n=>old.includes(n)!==next.includes(n)).map(n=>({category,item_id:String(n),value:next.includes(n)})));
 }
 async function login(){if(!supabase){setError('Đăng nhập Google chưa được kích hoạt. Cần kết nối dự án Supabase và cấu hình Google OAuth.');return;}
  setError('');const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+window.location.pathname,queryParams:{prompt:'select_account'}}});if(error)setError(error.message);
 }
 async function logout(){await flush();if(Object.keys(outbox.current).length){setError('Còn dữ liệu chưa đồng bộ. Hãy thử Đồng bộ lại trước khi đăng xuất.');return;}const {error}=await supabase!.auth.signOut();if(error)setError(error.message);}
 function importGuest(){let guest=readItems(storageRead(key('guest')));if(!Object.keys(guest).length){try{guest=legacyItems(JSON.parse(storageRead('uyen-days')||'[]'),JSON.parse(storageRead('uyen-words')||'[]'));}catch{}}write(Object.values(guest).filter(i=>i.category!=='attempt'&&i.value===true));}
 return {user,loading:loading||!authReady,blocked:loading||!authReady||!loaded.current,status,error,configured:!!supabase,login,logout,flush,importGuest,
 done:selected(items,'day').map(Number),known:selected(items,'word').map(Number),listened:selected(items,'listening'),attempts:Object.values(items).filter(i=>i.category==='attempt'),
 setDone:(v:number[]|((old:number[])=>number[]))=>setNumbers('day',v),setKnown:(v:number[]|((old:number[])=>number[]))=>setNumbers('word',v),
 markListening:(id:string,complete:boolean)=>write([{category:'listening',item_id:id,value:complete}]),
 recordAttempt:(day:number,score:number,total:number)=>write([{category:'attempt',item_id:crypto.randomUUID(),value:{day,score,total,at:new Date().toISOString()}}])};
}
