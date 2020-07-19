<p align="center">
  <img src="https://user-images.githubusercontent.com/22475804/87744584-341b2b00-c7c2-11ea-9a5c-f4b042a6ef56.png" height="200px" />
  <h1 align="center">Realm Data View</h1>
  <p align="center">Realm Data View is the open source application for developers who want to view the data stored on their android device using RealmDB simply and quickly.<p>  
</p>
<br />

### Beta 1.0.0 version available for Windows, Linux, Mac [(Download)](https://github.com/joseviniciusnunes/realm-data-view/releases)

## Requirements

-   Adb must be in the system path
-   The device must contain root
-   AVD use "Google APIs Intel x86 Atom System Image" not use "Google Play Intel x86 Atom System Image"

##### Preview

<p align="center">
  <img src="https://user-images.githubusercontent.com/22475804/87746674-8874d980-c7c7-11ea-887c-27cdd85d13a9.png">  
</p>

<br />
<br />
<br />

### Problems with adb path

<p align="center">
  <img src="https://user-images.githubusercontent.com/22475804/87866700-39f84400-c95b-11ea-8481-5b57b68c6d12.png">  
</p>

##### Modify the file found at `<USER>`/.realm-data-view/config.json, enter the exact path of your Android/sdk/platform-tools.

#### Example

##### /home/bill/.realm-data-view/config.json

```json
{
    "path": "/home/bill/Library/Android/sdk/platform-tools"
}
```
