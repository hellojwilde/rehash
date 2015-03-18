var {Store} = require('flummox');

class TopicStore extends Store {
  constructor(flux) {
    super();

    var meetingActions = flux.getActions('meeting'),
        topicActions = flux.getActions('topic');

    this.register(meetingActions.fetch, this.handleMeetingFetch);
    this.register(topicActions.create, this.handleTopicCreate);

    this.state = {};
  }

  getAllForDiscussion(meetingId) {
    return this.state[meetingId] || [];
  }

  handleMeetingFetch(meeting) {
    this.setState({
      [meeting.id]: meeting.topics
    });
  }

  handleTopicCreate(topic) {
    var topics = this.getAllForMeeting(topic.meetingId);

    this.setState({
      [topic.meetingId]: topics.concat(topic)  
    });
  }
}

module.exports = TopicStore;
