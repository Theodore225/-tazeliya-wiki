export function skipWelcome(type:string|undefined,entered:boolean,discarded=false){return entered&&(type==='reload'||type==='back_forward'||discarded);}
