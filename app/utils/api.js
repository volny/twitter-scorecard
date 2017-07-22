// TODO
// GO INTO THE OLD REPO AND FIND THAT GENIUS WAY TYLER MADE THE URLS OUT OF
// OBJECT PROPERTIES!

import axios from 'axios'

const id = 'YOUR_CLIENT_ID'
const sec = 'YOUR_SECRET_ID'
//const params = `?client_id=${id}&client_secret=${sec}`
const params = ''

const getProfile = (username) => {
  const URI = `https://api.github.com/users/${encodeURIComponent(username)}${encodeURIComponent(params)}`
  return axios.get(URI)
    .then((user) => user.data)
}

const getRepos = (username) => {
//  const URI = `https://api.github.com/users/${encodeURIComponent(username)}/repos${encodeURIComponent(params)}&per_page=100`
  const URI = `https://api.github.com/users/${encodeURIComponent(username)}/repos${encodeURIComponent(params)}`
  return axios.get(URI)
}

const getStarCount = (repos) => (
  repos.data.reduce((count, repo) => count + repo.stargazers_count
  , 0)
)

const calculateScore = (profile, repos) => {
  const followers = profile.followers
  const totalStars = getStarCount(repos)
  return followers * 3 + totalStars
}

const getUserData = (player) => {
  const array_of_promises = [
    getProfile(player),
    getRepos(player)
  ]
  // when all promises resolved then ...
  return axios.all(array_of_promises)
    .then((data) => {
      const profile = data[0]
      const repos = data[1]
      const score = calculateScore(profile, repos)
      return { profile, score }
    })
}

const sortPlayers = (players) => (
  players.sort((a,b) => b.score - a.score)
)

export const battle = (players) => {
  const array_of_promises = players.map(getUserData)
  return axios.all(array_of_promises)
    .then(sortPlayers)
    .catch((error) => console.warn(error))
}

export const fetchPopularRepos = (language) => {
  const URI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)
  return axios.get(URI)
    .then((response) => response.data.items)
}
