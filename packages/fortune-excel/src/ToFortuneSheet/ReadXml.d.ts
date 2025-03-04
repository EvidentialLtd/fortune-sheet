import { IuploadfileList, IattributeList } from "../common/ICommon";
declare class xmloperation {
    protected getElementsByOneTag(tag: string, file: string): string[];
}
export declare class ReadXml extends xmloperation {
    originFile: IuploadfileList;
    constructor(files: IuploadfileList);
    getElementsByTagName(path: string, fileName: string): Element[];
    private getFileByName;
}
export declare class Element extends xmloperation {
    elementString: string;
    attributeList: IattributeList;
    value: string;
    container: string;
    constructor(str: string);
    get(name: string): string | number | boolean;
    getInnerElements(tag: string): Element[];
    private setValue;
    private getFirstTag;
}
export interface IStyleCollections {
    [index: string]: Element[] | IattributeList;
}
export declare function getColor(color: Element, styles: IStyleCollections, type?: string): string | undefined;
export declare function getlineStringAttr(frpr: Element, attr: string): string;
export {};
