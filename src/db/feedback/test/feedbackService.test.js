// @flow
import mongoose from 'mongoose';
import { db } from 'db/mongodb';
import { FeedbackModel } from 'db/feedback/feedbackSchema';

beforeAll(async () => {
  const options = {
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  await mongoose.connect(global.process.env.MONGO_URL, options);
});

beforeEach(async () => {
  await FeedbackModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Feedback service', () => {
  it('should insert new feedback into collection', async () => {
    const mockFeedback = { gameId: '1234A', feedback: 'Test feedback' };
    await db.feedback.saveFeedback(mockFeedback);

    const insertedFeedback = await FeedbackModel.findOne(mockFeedback);
    expect(insertedFeedback.gameId).toEqual(mockFeedback.gameId);
    expect(insertedFeedback.feedback).toEqual(mockFeedback.feedback);
  });
});
