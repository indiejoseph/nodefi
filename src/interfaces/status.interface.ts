export interface Status {
  username: string;
  type: 'twitter' | 'discord' | 'snapshot';
  updatedAt?: Date;
  sinceId?: string;
}
