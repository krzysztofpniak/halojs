import moment from 'moment';
import {unfold, pipe} from 'ramda';
import {startOfQuarter} from 'date-fns';

const formats = {M: 'Y MMM', Q: 'Y \\QQ', Y: 'Y'};

const sequence = start => end => step =>
  pipe(
    x => moment(x),
    y => y.startOf(step),
    unfold(seed =>
      moment(seed) > moment(end)
        ? false
        : [
            {
              start: seed.clone().toDate(),
              end: seed.clone().add(1, step).toDate(),
              label: seed.format(formats[step]),
            },
            moment(seed).clone().add(1, step),
          ]
    )
  )(start);

describe('sequence', () => {
  it('should work with M', () => {
    expect(sequence('2022-01-04')('2022-03-04')('M')).toEqual([
      {
        start: new Date(2022, 0, 1),
        end: new Date(2022, 1, 1),
        label: '2022 Jan',
      },
      {
        start: new Date(2022, 1, 1),
        end: new Date(2022, 2, 1),
        label: '2022 Feb',
      },
      {
        start: new Date(2022, 2, 1),
        end: new Date(2022, 3, 1),
        label: '2022 Mar',
      },
    ]);
  });
  it('should work with Q', () => {
    expect(sequence('2022-01-04')('2022-07-04')('Q')).toEqual([
      {
        start: new Date(2022, 0, 1),
        end: new Date(2022, 3, 1),
        label: '2022 Q1',
      },
      {
        start: new Date(2022, 3, 1),
        end: new Date(2022, 6, 1),
        label: '2022 Q2',
      },
      {
        start: new Date(2022, 6, 1),
        end: new Date(2022, 9, 1),
        label: '2022 Q3',
      },
    ]);
  });
  it('should work with Y', () => {
    expect(sequence('2022-01-04')('2024-07-04')('Y')).toEqual([
      {
        start: new Date(2022, 0, 1),
        end: new Date(2023, 0, 1),
        label: '2022',
      },
      {
        start: new Date(2023, 0, 1),
        end: new Date(2024, 0, 1),
        label: '2023',
      },
      {
        start: new Date(2024, 0, 1),
        end: new Date(2025, 0, 1),
        label: '2024',
      },
    ]);
  });
});
