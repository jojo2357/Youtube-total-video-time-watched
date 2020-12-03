# Overview:
Spotify basically did their version of a "year in review" for all its users. This is my attempt to do that for youtube listeners.

I have two accounts, one for music, the other for leisure. There is no feature to look at only music. More unfortunately is that Youtube doesn't keep how long you watch a video for after two weeks ([sounds like another problem](https://www.github.com/jojo2357/GitHub-Views-Logger)) so this just sums the length of all the videos that you have watched in the past year.

# Setup:
### Creating an API token:
Create a project in the google developer console.

Go to the google developer portal and activate the youtube data api v3

Go to the dashboard and go to credentials, then create an api token.

Place the token in clientSecrets.json (please format it right)

### Getting your youtube data:
In order to prevent the struggle of oauth for each user, we instead manually download the data.

Head over to [google takeout](https://takeout.google.com/) and select **only** YouTube and YouTube Music

Click `Multiple formats` and on the only dropdown not greyed out select `json`

Where it says `All YouTube data included`, click that then deselect everything except `history`

Export the data and when you get the zip, unzip it and copy-paste `watch-history.json` into the root directory of this project

Run index.js and it should work!
