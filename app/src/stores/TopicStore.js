var {Store} = require('flummox');

class TopicStore extends Store {
  constructor(flux) {
    super();

    var meetingActionIds = flux.getActionIds('meeting'),
        topicActionIds = flux.getActionIds('topic');

    this.register(meetingActionIds.fetch, this.handleMeetingFetch);
    this.register(topicActionIds.create, this.handleTopicCreate);

    this.state = {};
  }

  getAllForMeeting(meetingId) {
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
