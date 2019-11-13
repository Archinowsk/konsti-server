// @flow
import { db } from 'db/mongodb';
import type { Signup } from 'flow/result.flow';

export const removeOverlappingSignups = async (
  signups: $ReadOnlyArray<Signup>
): Promise<void> => {
  try {
    await Promise.all(
      signups.map(async signup => {
        await db.user.saveSignup(signup);
      })
    );
  } catch (error) {
    throw new Error(`No assign results: saveSignup error: ${error}`);
  }
};
