/**
 * User information returned from `/api/info/v1/users/<uuid>` endpoint
 */
export interface GammaUserInfo {
  user: GammaUser;
  groups: {
    group: GammaGroup;
    post: GammaPost;
  }[];
}

export interface GammaUser {
  id: string;
  nick: string;
  firstName: string;
  lastName: string;
  acceptanceYear: number;
}

/**
 * A sub-group of a Gamma super group
 */
export interface GammaGroup {
  id: string;
  name: string;
  prettyName: string;
  groupMembers?: GammaGroupMember[];
  superGroup: GammaSuperGroup;
}

/**
 * Data for which post a user has in a Gamma group
 */
export interface GammaPost {
  id: string;
  svName: string;
  enName: string;
  emailPrefix: string;
}

/**
 * Super group list returned from `/info/v1/blob` endpoint
 */
export type GammaSuperGroupBlob = GammaSuperGroupListItem[];

/**
 * Super group item format returned from `/info/v1/blob` endpoint
 */
export interface GammaSuperGroupListItem {
  type: string;
  superGroups: {
    superGroup: GammaSuperGroup;
    members: GammaGroupMember[];
  }[];
}

export interface GammaSuperGroup {
  id: string;
  name: string;
  prettyName: string;
  type: string;
  svDescription: string;
  enDescription: string;
}

export interface GammaGroupMember {
  user: GammaUser;
  post: GammaPost;
  unofficialPostName?: string;
}

/**
 * Profile from OpenID Connect UserInfo endpoint on Gamma
 */
export interface GammaProfile {
  sub: string;
  picture: string;
  email?: string;
  given_name: string;
  family_name: string;
  nickname: string;
  locale: string;
}
