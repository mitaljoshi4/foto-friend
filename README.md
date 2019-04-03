# Foto Friend

## Project Definition


A user will be able to take pictures from 2 phone's simultaneously it could be a selfie or a landscape image. The first user will see a list of available users. Then the user can request to join with that user. once he/she accepts both will see an inline camera with shutter button in the bottom. when any of the users tap on shutter button then count down starts 3,2,1 and on 0 it will snap an image and join both images and show it both of the users. 

### Technical breakdown 

When the count down starts, save the time stamp of current UTC time with adding 3 seconds into the db. Other users will pick that up as they both are joined in 1 session/dbObject so that user's device will take image on the exact time provided from the server. Once taking the image is done then comes the storing part. store the image in firebase storage and save the ID in the database then using those 2 (or more IDs) and bring/download that image and combine them using HTML canvas and show it to the users who are in the session. they can save and share that image if they like otherwise discard it and start the process again. 


## Todos

✅ Create git repo 

✳️ Create firebase project with simple realtime db 

✳️ Create cordova app with webpack boilerplate 

✳️ Install required plugin and setup firebase auth, db and storage