# Repository Sync Setup Guide

This guide explains how to set up and use the automated repository synchronization workflows to sync code from this repository to the GEMINIGEN repository.

## 🔧 Setup Requirements

### 1. Create Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Set the following permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
4. Copy the generated token

### 2. Add Repository Secret

1. Go to this repository's Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GEMINIGEN_SYNC_TOKEN`
4. Value: Paste the personal access token created above
5. Click "Add secret"

### 3. Verify Target Repository Access

Ensure the token has write access to: `https://github.com/AINNATE-GEMINIGEN/imagen-frontend`

## 🚀 Available Workflows

### 1. Automatic Sync (sync-to-geminigen.yml)

**Trigger:** Automatically runs when code is pushed to `develop` branch

**Features:**
- ✅ Automatic sync on develop branch changes
- ✅ Smart change detection (only syncs when needed)
- ✅ Safe force-with-lease pushing
- ✅ Tag synchronization
- ✅ Detailed sync reports
- ✅ Manual trigger option

**Manual Trigger:**
1. Go to Actions tab
2. Select "Sync to GEMINIGEN Repository"
3. Click "Run workflow"
4. Choose options:
   - Force sync: Override change detection

### 2. Full Repository Sync (full-repo-sync.yml)

**Trigger:** Manual only (for comprehensive syncing)

**Features:**
- ✅ Sync all branches (optional)
- ✅ Sync all tags and releases
- ✅ Force push option (use with caution)
- ✅ Comprehensive sync verification
- ✅ Detailed reporting

**Manual Trigger:**
1. Go to Actions tab
2. Select "Full Repository Sync to GEMINIGEN"
3. Click "Run workflow"
4. Choose options:
   - Sync all branches: Include all branches, not just develop
   - Sync releases: Include tags and release branches
   - Force push: Override all conflicts (dangerous)

## 📋 Workflow Details

### Sync Process

1. **Checkout:** Fetch full repository history
2. **Configure:** Set up Git configuration
3. **Connect:** Add target repository as remote
4. **Check:** Detect if sync is needed
5. **Sync:** Push changes to target repository
6. **Verify:** Confirm sync integrity
7. **Report:** Generate detailed sync summary

### Safety Features

- **Change Detection:** Only syncs when changes are detected
- **Force-with-lease:** Prevents accidental overwrites
- **Concurrency Control:** Prevents multiple syncs running simultaneously
- **Error Handling:** Comprehensive error reporting and recovery
- **Verification:** Post-sync integrity checks

## 🔍 Monitoring and Troubleshooting

### Check Sync Status

1. Go to Actions tab
2. Look for workflow runs under "Sync to GEMINIGEN Repository"
3. Click on a run to see detailed logs and summary

### Common Issues

#### 1. Authentication Failed
**Error:** `remote: Invalid username or password`
**Solution:** 
- Verify `GEMINIGEN_SYNC_TOKEN` secret is set correctly
- Ensure token has `repo` permissions
- Check token hasn't expired

#### 2. Push Rejected
**Error:** `! [rejected] develop -> develop (non-fast-forward)`
**Solution:**
- Use "Full Repository Sync" with force push option
- Or manually resolve conflicts in target repository

#### 3. Repository Not Found
**Error:** `remote: Repository not found`
**Solution:**
- Verify target repository URL is correct
- Ensure token has access to target repository
- Check repository exists and is accessible

### Manual Sync Commands

If workflows fail, you can manually sync using these commands:

```bash
# Clone source repository
git clone https://github.com/AINNATE-IMAGEN/imagen-frontend.git
cd imagen-frontend

# Add target repository
git remote add target https://github.com/AINNATE-GEMINIGEN/imagen-frontend.git

# Sync develop branch
git push target develop:develop --force-with-lease

# Sync all branches
git push target --all --force-with-lease

# Sync tags
git push target --tags --force-with-lease
```

## 🛡️ Security Considerations

### Token Security
- Use minimal required permissions
- Regularly rotate access tokens
- Monitor token usage in audit logs
- Revoke tokens when no longer needed

### Repository Access
- Limit who can trigger manual syncs
- Monitor sync activities
- Review sync logs regularly
- Set up notifications for failed syncs

## 📊 Sync Monitoring

### Automated Notifications
The workflows automatically create detailed summaries including:
- Source and target commit hashes
- Sync status and timing
- Branch and tag counts
- Error details if sync fails

### Manual Verification
After sync, verify in target repository:
1. Check latest commit matches source
2. Verify all expected branches exist
3. Confirm tags are synchronized
4. Test application builds correctly

## 🔄 Sync Schedule

- **Automatic:** Every push to develop branch
- **Manual:** On-demand via GitHub Actions
- **Full Sync:** Recommended weekly or before major releases

## 📞 Support

If you encounter issues with the sync workflows:
1. Check the workflow logs in GitHub Actions
2. Verify all setup requirements are met
3. Try manual sync commands
4. Contact repository administrators for access issues
