### Steps to run the application

Clone the repo

`Run npm install`

The application runs on port 3000 by default, which can be configured through PORT environment variable.

Create a .env file in the root of the project and add below environment variables as needed

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>PORT</td>
      <td>Application port</td>
    </tr>
    <tr>
      <td>MONGODB_USER</td>
      <td>Mongodb user</td>
    </tr>
    <tr>
      <td>MONGODB_PASSWORD</td>
      <td>Mongodb password</td>
    </tr>
    <tr>
      <td>MONGDB_HOST</td>
      <td>Mongodb host</td>
    </tr>
    <tr>
      <td>MONGDB_PORT</td>
      <td>Mongodb port</td>
    </tr>
    <tr>
      <td>MONGODB_DATABASE</td>
      <td>Mongodb database</td>
    </tr>
  </tbody>
</table>

**Note** - The authentication database is supposed to be admin

**Note** - The date used in the api endpoints has to be in the format YYYY-MM-DD always, leading 0 is also required, so 2000-12-08 is valid and 2000-12-8 is invalid.
