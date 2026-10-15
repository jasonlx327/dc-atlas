"""Publish one allowlisted public-data file; never push application or workspace files."""
import base64
import json
import os
import subprocess
import sys

repo = os.environ["GITHUB_REPOSITORY"]
branch = "atlas-source-data"


def api(path, payload=None):
    command = ["gh", "api", "repos/" + repo + "/" + path]
    if payload is not None:
        command += ["--method", "POST", "--input", "-"]
    result = subprocess.run(command, input=json.dumps(payload) if payload is not None else None, text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError("GitHub API failed: " + path)
    return json.loads(result.stdout)


raw = open(sys.argv[1], "rb").read()
snapshot = json.loads(raw)
assert snapshot["schemaVersion"] == 1 and snapshot["sources"]
reference = subprocess.run(["gh", "api", "repos/" + repo + "/git/ref/heads/" + branch], capture_output=True, text=True)
parent = json.loads(reference.stdout)["object"]["sha"] if reference.returncode == 0 else None
blob = api("git/blobs", {"content": base64.b64encode(raw).decode(), "encoding": "base64"})
# An explicit one-file tree prevents repository history/private files from leaking.
tree = api("git/trees", {"tree": [{"path": "snapshot.json", "mode": "100644", "type": "blob", "sha": blob["sha"]}]})
commit = api("git/commits", {"message": "Refresh public issuer sources " + snapshot["generatedAt"], "tree": tree["sha"], "parents": [parent] if parent else []})
if parent:
    result = subprocess.run(["gh", "api", "repos/" + repo + "/git/refs/heads/" + branch, "--method", "PATCH", "--input", "-"], input=json.dumps({"sha": commit["sha"], "force": False}), text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError("Data branch moved; refusing to overwrite")
else:
    api("git/refs", {"ref": "refs/heads/" + branch, "sha": commit["sha"]})
print("Public snapshot commit:", commit["sha"])
