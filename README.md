# Case-9-mongodb-node

###### School project with Node.js, express, MongoDB, Mongoose and EJS

## "Tweet-applikation"

- A simple application where you have the opportunity to share posts if you have created a account. You can share public or private posts, leave a like or comment on all public posts. On your profile you find all of your shared posts, both public and private ones. Here you also have the possibility to edit or remove your post!

###### At the moment when you like a post the heart doesn't change from outlined to filled but you get the feedback in a message that pops up and the number of likes actually changes.
<br>
<br>
When creating an accout you need to enter your name, userneme, email, password and password again. The password get hashed with bcrypt. 
<br>

![Register](/docs/Register.png)
<br>

When logged in you get access to all public posts.
<br>

![Dashboard](/docs/Dashboard.png)
<br>

You can share post by clicking the + button down in the middle.
<br>

![Share poost](/docs/Sharepost.png)
<br>

This is the profile, you see all your private and public posts.
<br>

![Share post](/docs/Profile.png)
<br>

By pressing the three dots on the post you can choose to edit or delete the post.
<br>

![Edit buttons](/docs/Profile-btns.png)
<br>

By clicking the edit btn you get this popup form
<br>

![Edit buttons](/docs/Profile-edit.png)
<br>


When saving the edit this message pops up. Also when adding new post, deleting post, logs in and logs out.
<br>

![Message](/docs/Profile-flash.png)

<br>
<br>

# If you want to clone the project to your computer follow this steps:

1. Copy this link: https://github.com/annalindqvist/Case-9-mongodb-node.git
2. In VSC terminal type: "git clone https://github.com/annalindqvist/Case-9-mongodb-node.git" and press enter
3. CD into projekt "cd Case-9-mongodb-node"
4. Run "npm install" in terminal
5. Create a .env file with the same content as in .env-example
- 5.1: if you don't have an accout on Mongo DB you need to create one and after that create a database so you get the MongoDB Connection string
6. To run project on your localhost:3000 type "npm run dev" in terminal