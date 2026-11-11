"""Manual SQLite backup and retention utilities for GrapeCrux."""
from __future__ import annotations
import argparse, os, sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path
DB=Path(os.getenv("DATABASE_PATH","/data/grapecrux-enquiries.sqlite3"))
BACKUP_DIR=Path(os.getenv("BACKUP_DIR","/data/backups"))
def backup():
    if not DB.exists(): raise FileNotFoundError("Database does not exist: "+str(DB))
    BACKUP_DIR.mkdir(parents=True,exist_ok=True)
    target=BACKUP_DIR/("grapecrux-enquiries-"+datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")+".sqlite3")
    with sqlite3.connect(DB) as src, sqlite3.connect(target) as dst: src.backup(dst)
    try: os.chmod(target,0o600)
    except OSError: pass
    return target
def purge(days: int):
    if days < 30: raise ValueError("Retention must be at least 30 days; confirm the policy first.")
    cutoff=(datetime.now(timezone.utc)-timedelta(days=days)).isoformat(timespec="seconds")
    with sqlite3.connect(DB) as connection:
        cursor=connection.execute("DELETE FROM enquiries WHERE created_at < ?",(cutoff,))
        connection.commit()
        return cursor.rowcount
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("action",choices=["backup","purge"])
    parser.add_argument("--retention-days",type=int,default=int(os.getenv("LEAD_RETENTION_DAYS","365")))
    args=parser.parse_args()
    if args.action=="backup": print("Backup created:",backup())
    else: print("Purged",purge(args.retention_days),"record(s).")
if __name__=="__main__": main()
