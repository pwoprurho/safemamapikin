# Kusmus AI: Build & Delivery Guide

This guide explains how to build and deliver binaries for **Kusmus AI (Community Edition)** across Windows, Android, and iOS.

## 1. Cloud-Native Build (GitHub Actions)

The most efficient way to generate binaries is via **GitHub Actions**. This handles the environment setup and CI/CD pipeline automatically.

### Step 1: Push to GitHub
1. Ensure you have a new private repository at: `https://github.com/pwoprurho/safemamapikin.git`
2. Push the contents of the `pocketpal-ai` directory to your repo:
   ```bash
   cd pocketpal-ai
   git init
   git add .
   git commit -m "Initial Kusmus AI rebranding"
   git remote add origin https://github.com/pwoprurho/safemamapikin.git
   git push -u origin main
   ```

### Step 2: Configure GitHub Secrets (Sensitive)
Navigate to **Settings > Secrets and variables > Actions** and add the following **Secrets**:

| Secret Name | How to obtain / Value |
| :--- | :--- |
| `DEPLOY_KEY` | *(Optional)* SSH Private Key for repository access if using private submodules. |
| `ANDROID_KEYSTORE_BASE64` | **How to get:** Run `keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000`. Then encode it: `cat release.keystore \| base64` |
| `ANDROID_KEYSTORE_PASSWORD` | The password you set when creating the keystore above. |
| `ANDROID_KEY_ALIAS` | The alias you set (e.g., `release`). |
| `ANDROID_KEY_PASSWORD` | The password for the specific alias (usually same as keystore password). |
| `PLAY_STORE_SERVICE_ACCOUNT_JSON` | **How to get:** Google Play Console > Setup > API Access > Create Service Account > Generate JSON key in Google Cloud Console. |
| `GOOGLE_SERVICES_JSON` | **How to get:** Firebase Console > Project Settings > General > Add Android App > Download `google-services.json`. |
| `SUPABASE_ANON_KEY` | **From `.env`:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkanhkaGNsYnJ3cWhuYmtjYW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDE5MzcsImV4cCI6MjA4MDc3NzkzN30.WAVMmr4fSd6xyC7Fj3mK_-NjOGTot7wFnFnk4XBOW5w` |
| `MATCH_PASSWORD` | **How to get:** A strong password you choose to encrypt iOS certs when running `fastlane match`. |
| `MATCH_GIT_URL` | **How to get:** Create a new blank **private** GitHub repository to store iOS certificates. Use its Git URL. |
| `MATCH_GITHUB_TOKEN` | **How to get:** GitHub Settings > Developer Settings > Personal Access Tokens > Generate new token (classic) with `repo` scope. |
| `APP_STORE_CONNECT_API_KEY_ID` | **How to get:** App Store Connect > Users and Access > Keys > Generate new API Key. |
| `APP_STORE_CONNECT_API_ISSUER_ID` | **How to get:** Found on the same page as the API Key in App Store Connect. |
| `APP_STORE_CONNECT_API_KEY_CONTENT` | **How to get:** The text contents of the downloaded `.p8` file from App Store Connect. |
| `GOOGLE_SERVICES_PLIST` | **How to get:** Firebase Console > Project Settings > Add iOS App > Download `GoogleService-Info.plist`. |

### Step 3: Configure GitHub Variables (General Config)
Navigate to **Settings > Secrets and variables > Actions** and add the following **Variables**:

| Variable Name | How to obtain / Value |
| :--- | :--- |
| `SUPABASE_URL` | **From `.env`:** `https://bdjxdhclbrwqhnbkcaoe.supabase.co` |
| `PALSHUB_API_BASE_URL` | *Optional*, can leave blank or use `https://api.palshub.org` |
| `FIREBASE_FUNCTIONS_URL` | **How to get:** Firebase Console > Build > Functions. (URL of deployed functions, if any). |
| `GOOGLE_WEB_CLIENT_ID` | **How to get:** Google Cloud Console > APIs & Services > Credentials > Create OAuth Client ID (Web application). |
| `GOOGLE_IOS_CLIENT_ID` | **How to get:** Same as above, but for iOS application type. |
| `REVERSED_GOOGLE_IOS_CLIENT_ID` | **How to get:** Found inside the `GoogleService-Info.plist` file. |

### Step 4: Run the Workflow
1. Go to the **Actions** tab in your GitHub repository.
2. Select **Release Workflow**.
3. Click **Run workflow**, choose a version type (e.g., `patch`), and click the green button.
4. **Result**: The workflow will automatically bump the version, create a GitHub Release with the `.apk`, and upload the `.ipa` to TestFlight.

---

## 2. Windows (.zip) Delivery

The current Windows version is a high-performance web wrapper of your community hub, ensuring institutional users have a familiar desktop experience.

### Pre-built Binary
A pre-built Windows wrapper is available on your server:
- **Location**: `static/downloads/kusmus-ai-community-windows.zip`

### Manual Re-build
To re-build the Windows wrapper locally:
```powershell
npx --yes nativefier --name "Kusmus AI" "https://kusmus.org/community" --internal-urls ".*kusmus\.org.*" --icon "assets/icon.png" --out "static/downloads/" --portable
```

---

## 3. Local Technical Builds

### Android Build (Local)
Ensure you have **OpenJDK 17** and **Android SDK** installed.
```bash
$env:ANDROID_HOME = "C:\Program Files (x86)\Android\android-sdk"
$env:JAVA_HOME = "C:\Program Files (x86)\Android\openjdk\jdk-17.0.14"
cd android
./gradlew assembleRelease
```

### iOS Build (Local - macOS only)
```bash
cd ios
pod install
xcodebuild -workspace PocketPal.xcworkspace -scheme PocketPal -configuration Release
```

---

## Support & Enterprise
For air-gapped **Sovereign Agent** binaries (Native C++/Rust execution) for government or high-security banking, please contact your Kusmus Communications integration lead.
