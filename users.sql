-- id
-- firstName
-- lastName
-- email - put "unique constrain" on the email
-- Password (which should first be hashed!!)
-- created_at
-- firstname, lastname, email and password must be filled in
-- <<petition part3>> - registration and login

-- Registration
--  new template with <form> and 4 input fields
--  server-side: hash the password and INSERT first, last, email and hashed password into the new users table
--  put userID in cookie, and the value of the userID cookie should be the id that was generated by postgres when we did the INSERT


-- Login
--  new template with <form> and 2 input fields
--  server-side - we need to get the user's hashed password from database, and then compare that hash with the password we got from the input field
--  if they match then store userId in cookie
--


-- Petition
--  now we have user's first and last name, we should remove input fields for first and laast (because we're getting the user's first and last name from the registration /login pages)
--  greet user by name (Hi, ivana): this page needs to remember ivana is already registred on the website


-- Logout
--  delete everything in the user's cookie
--  'req.session = null'
--  logout can happen on GET or POST request

-- only certain users will have permission to view certain pages. For example, if a user is NOT logged in or registered they should not be allowed to see any other page of your website other than registration or login.
-- if the user hasn't signed the petition yet, the user should not be able to see the "thank-you" page
