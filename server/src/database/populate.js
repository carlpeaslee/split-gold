import Person from './models/Person'
import fetch from 'isomorphic-fetch'
import uuid from 'uuid'

const allUsersUrl = 'https://carlpeaslee.auth0.com/api/v2/users?per_page=100&page=0&include_totals=true&sort=created_at%3A1&search_engine=v2'

const options = () => {
  return {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJkajdDOVFCZkV3cG45bVBTSE1FUU04YnduNU9lNHZ0bSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0ODAyNDQ2MDQsImp0aSI6IjVhMjZmMjlmZDQ2MzAzY2ZiMmQyOGYxMjBjNjRkOGE0In0.mi96x-Q-1-2Vam4wTNWxAruTtqqA_G6TkSbbp3q__TQ'
    },
  }
}

const auth0users = async () => {
  try {
    const result = await fetch(allUsersUrl, options())
    const data = await result.json()
    console.log('sync data')
    const users = []
    data.users.forEach((user)=>{
      let email = user.email
      let name = user.name
      let auth0id = user['user_id'].slice(6)
      let profilePicUrl = user.picture
      let personID = uuid.v4()
      users.push({
        email,
        name,
        auth0id,
        profilePicUrl,
        personID
      })
    })
    return users
  } catch (error) {
    console.log('syncing error', error)
  }
}

const populate = async () => {
  try {
    const users = await auth0users()

    users.forEach( (user, index) => {
      Person.findOrCreate({
        where: {
          auth0id: user.auth0id
        },
        defaults: {
          ...user
        }
      }).spread((user,created)=> {
        console.log(index)
      })
    })
  } catch (error) {
    console.log('syncing error', error)
  }


}


export default populate
