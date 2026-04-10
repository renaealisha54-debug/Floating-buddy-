

@app.post("/api/execute")
async def execute(data: dict):
    code = data.get("code")
    lang = data.get("language")
    
    if lang == "java":
        # Java requires the filename to match the class name (Main)
        with open("Main.java", "w") as f:
            f.write(code)
        try:
            # Compile
            compile_proc = subprocess.run(["javac", "Main.java"], capture_output=True, text=True)
            if compile_proc.returncode != 0:
                return {"result": compile_proc.stderr}
            # Run
            run_proc = subprocess.run(["java", "Main"], capture_output=True, text=True)
            return {"result": run_proc.stdout or run_proc.stderr}
        finally:
            # Cleanup
            if os.path.exists("Main.java"): os.remove("Main.java")
            if os.path.exists("Main.class"): os.remove("Main.class")
            
    # ... existing python/js logic …
