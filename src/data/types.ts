import { IDraftsTableColumns } from "@/lib/interfaces";

export const VDraftsTableColumns: IDraftsTableColumns = {
    "date": "Created On",
    "title": "Title",
    "snippet": "Draft",
    "id": "ID"
}

export enum TDraftElementsCategory {
    CARD,
    FULL
}