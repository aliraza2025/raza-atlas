import {StateGraph,Annotation,MemorySaver,interrupt,Command,START,END} from '@langchain/langgraph';
import {quoteService,parseRequest,draftQuote} from './public/domain.js';
export function createWorkflow(options={}){
 const State=Annotation.Root({input:Annotation(),quote:Annotation(),draft:Annotation(),status:Annotation(),trace:Annotation(),decision:Annotation(),intent:Annotation()});
 const writes=new Map();
 const graph=new StateGraph(State)
 .addNode('intake',async state=>{const parsed=parseRequest(state.input.request);const intent=options.classify?await options.classify(state.input.request):'quote';if(!['quote','booking','handoff'].includes(intent))throw new Error('The local model returned an unknown intent.');return {intent,status:parsed.needsHuman||intent==='handoff'?'handoff':'planning',trace:[options.classify?`Local model classified intent: ${intent}`:'Validated intake with a rule baseline']};})
 .addNode('calculate',state=>{const quote=quoteService(state.input);return {quote,draft:draftQuote(quote),trace:[...state.trace,'Looked up fictional catalog','Calculated quote in code']};})
 .addNode('review',state=>{const decision=interrupt({draft:state.draft,quote:state.quote});if(!['approve','reject'].includes(decision))throw new Error('Review must be approve or reject.');return {decision,status:decision==='approve'?'approved':'rejected',trace:[...state.trace,`Human decision: ${decision}`]};})
 .addNode('handoff',(_state,config)=>{const id=config.configurable.thread_id;if(!writes.has(id))writes.set(id,{id,status:'sandbox_recorded'});return {trace:[..._state.trace,'Sandbox handoff recorded once; no external write']};})
 .addEdge(START,'intake').addConditionalEdges('intake',state=>state.status==='handoff'?END:'calculate')
 .addEdge('calculate','review').addConditionalEdges('review',state=>state.decision==='approve'?'handoff':END).addEdge('handoff',END)
 .compile({checkpointer:new MemorySaver()});
 const start=async(input,id)=>{const config={configurable:{thread_id:id}};const result=await graph.invoke({input},config);return {...result,status:result.__interrupt__?.length?'awaiting_review':result.status,threadId:id,runtime:'LOCAL LANGGRAPH / DETERMINISTIC PLANNER'};};
 const resume=async(id,decision)=>{const config={configurable:{thread_id:id}};const state=await graph.getState(config);if(!state.next.length)throw new Error('No pending review exists for this thread.');const result=await graph.invoke(new Command({resume:decision}),config);return {...result,threadId:id,runtime:'LOCAL LANGGRAPH / DETERMINISTIC PLANNER'};};
 return {start,resume,writes};
}
