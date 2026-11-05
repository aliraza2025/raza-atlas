"""Run Graphify's AST engine; normalize unresolved references into explicit nodes."""
from pathlib import Path
import sys,json,time,contextlib,importlib.metadata,subprocess
ROOT=Path(__file__).resolve().parents[1]
def extract_graph(source):
    from graphify.extract import extract
    source=source.resolve()
    files=sorted(p for p in source.rglob("*") if p.suffix in (".py",".js",".mjs",".ts",".tsx") and not any(x in p.parts for x in ("node_modules",".git",".venv")))
    if not files or len(files)>100:raise ValueError("Choose a snapshot with 1–100 code files.")
    with contextlib.redirect_stdout(sys.stderr):
        result=extract(files,root=source,cache_root=ROOT/".cache",parallel=False)
    nodes=result["nodes"];ids={n["id"] for n in nodes}
    for e in result["edges"]:
        for key in ("source","target"):
            if e[key] not in ids:
                nodes.append({"id":e[key],"label":e[key].removeprefix("ref_").replace("_"," / "),"external":True});ids.add(e[key])
    return {"nodes":nodes,"edges":result["edges"],"metadata":{"engine":"Graphify AST "+importlib.metadata.version("graphifyy"),"codeOnly":True,"modelTokens":result.get("input_tokens",0)+result.get("output_tokens",0),"failedSources":result.get("failed_sources",[]),"limitations":"Static extraction; dynamic behavior and unresolved imports need review."}}
if __name__=="__main__":
    source=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/"sample-project"
    graph=extract_graph(source)
    provenance=ROOT/"examples/source-provenance.json"
    if source.resolve()==(ROOT/"sample-project").resolve() and provenance.exists():graph["metadata"].update(json.loads(provenance.read_text()))
    destination=Path(sys.argv[2]) if len(sys.argv)>2 else ROOT/"public/graph.json"
    destination.write_text(json.dumps(graph,indent=2)+"\n")
    print(json.dumps({"nodes":len(graph["nodes"]),"edges":len(graph["edges"]),"modelTokens":graph["metadata"]["modelTokens"]}))
