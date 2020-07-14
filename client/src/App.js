import React, { Component } from 'react';
import { Grid, Input, Button } from 'semantic-ui-react';
import axios from 'axios';
import TweetsList from './TweetsList';
class App extends Component {
  state = { tweets: [], visible: [], search: '', tweet: '' }
  componentDidMount() {
    axios.get('/api/tweets')
      .then( res => this.setState({ tweets: res.data }))
      .catch( err => console.log(err))
  }
  updateTweetState = (e) => {
    this.setState({ tweet: e.target.value })
  }
  postTweet = () => {
    const { tweet, visible } = this.state
    if (tweet) {
      axios.post('/api/tweet', { tweet })
        .then( res => this.setState({ visible: [...visible, res.data], tweet: '' }))
    }
  }
  handleChange = (e) => {
    this.setState({ search: e.target.value }, () => {
      this.updateVisible()
    })
  }
  updateVisible = () => {
    const { search, tweets } = this.state
    if (search.length === 0) {
      this.setState({ visible: tweets })
    } else if (search.length > 3) {
      axios.get(`/api/search?term=${search}`)
        .then( res => this.setState({ visible: res.data }))
        .catch( err => console.log(err))
    }
  }
  render() { 
    const { visible, search, tweet } = this.state
    return(
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={6}>
            <h1>Search</h1>
            <Input
              value={search}
              onChange={this.handleChange}
              icon={{ name: 'search', circular: true }}
              placeholder="Search..."
            />
            <hr />
            <h1>Tweeting something</h1>
            <Input onChange={this.updateTweetState} value={tweet} />
            <Button onClick={this.postTweet}>Tweet!</Button>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={10}>
            <TweetsList tweets={visible} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
export default App;