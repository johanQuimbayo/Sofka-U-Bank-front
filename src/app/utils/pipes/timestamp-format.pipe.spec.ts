import { TimestampFormatPipe } from './timestamp-format.pipe';

describe('TimestampFormatPipe', () => {
  let pipe: TimestampFormatPipe;

  beforeEach(() => {
    pipe = new TimestampFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if value is null or undefined', () => {
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should format a valid timestamp correctly', () => {
    const timestamp = '2025-02-05T14:30:00Z'; 
    expect(pipe.transform(timestamp)).toBe('2025-02-05 , 14:30');
  });

  it('should correctly format timestamps without timezone info', () => {
    const timestamp = '2025-02-05T10:45:00';
    const date = new Date(timestamp);

    const expectedFormat = `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)} , ${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}`;

    expect(pipe.transform(timestamp)).toBe(expectedFormat);
  });
});
