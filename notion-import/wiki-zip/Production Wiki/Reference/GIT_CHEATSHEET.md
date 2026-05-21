# Git Cheatsheet — Daily Reference

## "I want to see what's changed"
```bash
git status          # What files have changed since my last commit?
git diff            # Show me exactly which lines changed (press Q to exit)
```

## "I want to save my work"
```bash
git add .           # Stage everything (move files to the staging area)
git add <file>      # Stage one specific file
git commit -m "Describe what you did in imperative mood"
```

## "I want to share my work"
```bash
git push            # Send my commits up to GitHub (after first push is set up)
```

## "I want to get others' changes"
```bash
git pull            # Download and apply any commits Miriam (or others) pushed
```

## "I want to try something risky"
```bash
git checkout -b my-branch-name     # Create a new branch and switch to it
# ... do your work, add, commit ...
git push -u origin my-branch-name  # Push the branch to GitHub
gh pr create                       # Open a pull request
gh pr merge --merge                # Merge it when ready
git checkout main                  # Switch back to main
git pull                           # Get the merged changes
git branch -d my-branch-name       # Delete branch locally
git push origin --delete my-branch-name  # Delete branch on GitHub
```

## "I want to see what I did"
```bash
git log             # Show all commits (press Q to exit)
git log --oneline   # Same thing, more compact
```

## "I broke something — undo!"

**Undo changes to a file you haven't committed yet:**
```bash
git restore <file>  # WARNING: throws away your unsaved changes permanently
```

**Unstage a file (move it back out of staging without losing changes):**
```bash
git restore --staged <file>   # Safe — your edits are preserved
```

**Undo the last commit but keep your changes:**
```bash
git reset --soft HEAD~1   # Moves the commit back to staging — your work is safe
```

**⚠️ Never run this unless you are certain:**
```bash
git reset --hard HEAD~1   # Discards the last commit AND all changes. Gone forever.
```

## Everyday flow (the one you'll use 90% of the time)
```bash
git status                    # See what's changed
git add .                     # Stage everything
git commit -m "Your message"  # Save the snapshot
git push                      # Send to GitHub
```
