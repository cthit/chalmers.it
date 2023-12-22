export interface Authority {
    id: string;
    authority: string;
}

export interface GammaGroup {
    id: string;
    becomesActive?: number;
    becomesInactive?: number;
    description: {
        sv: string;
        en: string;
    };
    function?: {
        sv: string;
        en: string;
    };
    email: string;
    name: string;
    prettyName: string;
    superGroup?: GammaSuperGroup;
    active?: boolean;
}

export interface GammaSuperGroup {
    id: string;
    name: string;
    prettyName: string;
    type: string;
    email: string;
}

export interface GammaUser {
    cid: string;
    nick: string;
    firstName: string;
    lastName: string;

    email: string;
    phone: string;
    avatarUrl?: string;
    acceptanceYear: number;
    gdpr: boolean;
    language: string;
    authorities: [{ id: string; authority: string }];
    groups: GammaGroup[];
    websiteURLs?: string;
    //Internal extension
    isSiteAdmin: boolean;
    accessToken?: string;
    gameOwnerId: string;
}

export interface GammaGroupMember {
    post: GammaPost
    fkitGroupDTO: GammaGroup
    unofficialPostName: string
    id: string
    cid: string
    nick: string
    firstName: string
    lastName: string
    avatarUrl: string
    acceptanceYear: number
    gdpr: boolean
    language: string
    authorities: any
}

export interface GammaPost {
    id: string
    sv: string
    en: string
    emailPrefix: string
}