#!/bin/bash
# Install the twice-daily health check LaunchAgent on macOS.
# Run once from the repo root: bash scripts/install-health-scheduler.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLIST_NAME="com.gsr.health-check"
PLIST_DST="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"
SCRIPT="$REPO_ROOT/scripts/health-check-local.sh"

echo "=== GSR Health Check Scheduler — macOS LaunchAgent ==="
echo "Repo root: $REPO_ROOT"
echo "Script:    $SCRIPT"
echo "Plist:     $PLIST_DST"
echo ""

# Make the health check script executable
chmod +x "$SCRIPT"
chmod +x "$REPO_ROOT/scripts/check-routes.sh"
chmod +x "$REPO_ROOT/scripts/check-config.sh"
chmod +x "$REPO_ROOT/scripts/check-dupes.sh"

# Write the plist with the actual repo path baked in
cat > "$PLIST_DST" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PLIST_NAME</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$SCRIPT</string>
    </array>

    <!-- Run at 8:00 AM and 8:00 PM local time -->
    <key>StartCalendarInterval</key>
    <array>
        <dict>
            <key>Hour</key>   <integer>8</integer>
            <key>Minute</key> <integer>0</integer>
        </dict>
        <dict>
            <key>Hour</key>   <integer>20</integer>
            <key>Minute</key> <integer>0</integer>
        </dict>
    </array>

    <key>StandardOutPath</key>
    <string>$REPO_ROOT/.claude/health-check.log</string>
    <key>StandardErrorPath</key>
    <string>$REPO_ROOT/.claude/health-check.log</string>

    <!-- Run immediately if a scheduled time was missed (e.g. Mac was asleep) -->
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
PLIST

# Unload any existing version before reloading
launchctl unload "$PLIST_DST" 2>/dev/null || true

# Load the new agent
launchctl load "$PLIST_DST"

echo "✓ LaunchAgent installed and loaded."
echo ""
echo "The health check will run automatically at 8:00 AM and 8:00 PM."
echo "macOS notifications will appear when checks pass or fail."
echo ""
echo "To run a check right now:"
echo "  bash $SCRIPT"
echo ""
echo "To view the log:"
echo "  cat $REPO_ROOT/.claude/health-check.log"
echo ""
echo "To uninstall:"
echo "  launchctl unload $PLIST_DST && rm $PLIST_DST"
