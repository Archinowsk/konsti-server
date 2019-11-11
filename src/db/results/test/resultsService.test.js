// @flow
import mongoose from 'mongoose';
import { db } from 'db/mongodb';
import { ResultsModel } from 'db/results/resultsSchema';

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
  await ResultsModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Results service', () => {
  it('should insert new result into collection', async () => {
    const signupResultData = [];
    const startTime = '2019-07-26T14:00:00.000Z';
    const algorithm = 'group';
    const message = 'Test assign result message';

    await db.results.saveResult(
      signupResultData,
      startTime,
      algorithm,
      message
    );

    const insertedResults = await ResultsModel.findOne({ message });
    expect(insertedResults.message).toEqual(message);
  });
});
