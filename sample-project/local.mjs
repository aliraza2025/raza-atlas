import {randomUUID} from 'node:crypto';
import {createWorkflow} from './workflow.mjs';
import {present} from './public/core.js';
const workflow=createWorkflow();
export async function runLocal({input,previous,action}){return present(action?await workflow.resume(previous?.threadId,action):await workflow.start(input,randomUUID()));}
export async function runAudio(){throw new Error('Use the voice sandbox for transcription.');}
