# Curren - The currency bot
## Android Client

### Getting Started

 * Clone the complete project
    ```bash
    $ git clone https://github.com/sdabhi23/Curren.git
    ```
 * Open your Android Studio and go to **Files > Open Project** and navigate to the project directory.
 * Set-up a Dialogflow Agent for the chatbot as described [here :link:]()
 * Get the Client Access Token from the Dialogflow agent. It is available under the **API Keys** Section under **General Settings** of your agent.
     ![ss1](https://i.imgur.com/ttrJGsD.png)
 * Replace the Client Access Token on line 87 in the [ChatActivity.java :link:](https://github.com/sdabhi23/Curren/blob/master/app/src/main/java/com/shrey/curren/ChatActivity.java) with your token.

### Prerequisites

Having **JDK 8** or higher installed along side **Android Studio 3.0 or higher** is a major prerequisite as lambda expressions used in this project are not supported in the older versions of JAVA and Android Studio.

### Setting up the Firebase Credentials

 > For every Dialogflow chat agent you create, a Firebase project is created by default. You will need the credetials of that project to save and manage the chat histories of your users.

 * Go to [Firebase Console :link:](https://console.firebase.google.com) and add your app to your Firebase Project.
 
 > #### :bangbang: You can skip the steps below if you already know how to add an Android app to a Firebase Project
 
 * On opening the project your screen should look something like the one given below:
     
     ![ss2](https://i.imgur.com/fZ1zniL.png)
     
 * Fill in the **Android package name** and **Debug signing certificate SHA-1** and click _REGISTER APP_
     
     ![ss3](https://i.imgur.com/ZraAvRV.png)
     
     * Here's how to obtain the SHA-1 hash of your signing certificate: [https://developers.google.com/android/guides/client-auth :link:](https://developers.google.com/android/guides/client-auth)
     
 * Download the google-services.json file in this step and replace the one already existing in the [android-app/app :link:](https://github.com/sdabhi23/Curren/tree/master/app) directory with the one you downloaded.
     
     ![ss4](https://i.imgur.com/BOX8sb7.png)
     
 * The Firebase SDK and Dialogflow SDK has already been configured in the project.

### Running the app

There are 2 ways to run the app :
    
1. Using an emulator
    
    * You can either use the inbulit emulator as shown [here :link:](https://developer.android.com/studio/run/emulator.html) or use any of the 3rd party emulators available in the market.
     > Genymotion is one of the most popular 3rd party emulators available. Here's a [link :link:](https://docs.genymotion.com/Content/04_Tools/Genymotion_Plugin_for_Android_Studio/Genymotion_Plugin_for_Android_Studio.htm) on testing Android apps on Genymotion and Android Studio

2. Using a physical device

    * This one of the easiest ways to test an app if you own an Android device. [This guide :link:](https://developer.android.com/studio/run/device.html) will help you setup your device and install necessary drivers for testing apps.

> :bangbang: Note : This app will run only on devices and emulators running **Android Kitkat 4.4 (API 19)** and above. To support older versions manually edit [app level build.gradle :link:](https://github.com/sdabhi23/Curren/blob/master/app/build.gradle).

> :warning: Warning : Trying to support older versions of Android might result in broken dependencies

### [Link to the .apk file](http://www.mediafire.com/file/i3axz74qkccfitq/Curren.apk)
