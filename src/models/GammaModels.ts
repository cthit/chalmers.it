export interface Authority {
  id: string;
  authority: string;
}

export interface GammaGroup {
  id: string;
  name: string;
  prettyName: string;
  groupMembers?: GammaGroupMember[];
  superGroup: GammaSuperGroup;
}

export interface GammaSuperGroup {
  id: string;
  name: string;
  prettyName: string;
  type: string;
  svDescription: string;
  enDescription: string;
}

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

export interface GammaGroupMember {
  user: GammaUser;
  post: GammaPost;
  unofficialPostName?: string;
}

export interface GammaPost {
  id: string;
  svName: string;
  enName: string;
  emailPrefix: string;
}

export interface GammaProfile {
  sub: string;
  picture: string;
  email?: string;
  given_name: string;
  family_name: string;
  nickname: string;
  locale: string;
}
