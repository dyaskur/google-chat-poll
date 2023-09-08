import ScheduleClosePollFormCard from '../../src/cards/ScheduleClosePollFormCard';
import {dummyAutoclosePollState, dummyLocalTimezone, dummyPollState} from '../dummy';

describe('ScheduleClosePollFormCard', () => {
  it('should crate form without any schedule time info', () => {
    const card = new ScheduleClosePollFormCard(dummyPollState, dummyLocalTimezone).create();
    expect(card.header.title).toBe('Schedule Close Poll');
    expect(card.header.subtitle).toBe('You can schedule the poll to close here.');
    // since not scheduled, the schedule info should undefined
    expect(card.sections!.find((section) => section.widgets?.[0]?.decoratedText?.startIcon?.knownIcon === 'CLOCK')).
      toBeUndefined();
    expect(JSON.stringify(card)).toContain('Create Schedule Close');
  });
  it('should crate form with correct state', () => {
    const card = new ScheduleClosePollFormCard(dummyAutoclosePollState, dummyLocalTimezone).create();
    const result = card.sections!.find(
      (section) => section.widgets?.[0]?.decoratedText?.startIcon?.knownIcon === 'CLOCK');
    expect(result).toBeDefined();

    expect(JSON.stringify(card)).toContain('Edit Schedule Close');
  });
});
