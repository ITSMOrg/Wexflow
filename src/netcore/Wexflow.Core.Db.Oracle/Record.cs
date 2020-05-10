﻿namespace Wexflow.Core.Db.Oracle
{
    public class Record : Core.Db.Record
    {

        public static readonly string ColumnName_Id = "ID";
        public static readonly string ColumnName_Name = "NAME";
        public static readonly string ColumnName_Description = "DESCRIPTION";
        public static readonly string ColumnName_Approved = "APPROVED";
        public static readonly string ColumnName_StartDate = "START_DATE";
        public static readonly string ColumnName_EndDate = "END_DATE";
        public static readonly string ColumnName_Comments = "COMMENTS";
        public static readonly string ColumnName_ManagerComments = "MANAGER_COMMENTS";
        public static readonly string ColumnName_CreatedBy = "CREATED_BY";
        public static readonly string ColumnName_CreatedOn = "CREATED_ON";
        public static readonly string ColumnName_ModifiedBy = "MODIFIED_BY";
        public static readonly string ColumnName_ModifiedOn = "MODIFIED_ON";
        public static readonly string ColumnName_AssignedTo = "ASSIGNED_TO";
        public static readonly string ColumnName_AssignedOn = "ASSIGNED_ON";

        public static readonly string TableStruct = "(" + ColumnName_Id + " NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, "
                                                        + ColumnName_Name + " VARCHAR2(512), "
                                                        + ColumnName_Description + " VARCHAR2(4000), "
                                                        + ColumnName_Approved + " NUMBER(1), "
                                                        + ColumnName_StartDate + " TIMESTAMP, "
                                                        + ColumnName_EndDate + " TIMESTAMP, "
                                                        + ColumnName_Comments + " VARCHAR2(4000), "
                                                        + ColumnName_ManagerComments + " VARCHAR2(4000), "
                                                        + ColumnName_CreatedBy + " INTEGER, "
                                                        + ColumnName_CreatedOn + " TIMESTAMP, "
                                                        + ColumnName_ModifiedBy + " INTEGER, "
                                                        + ColumnName_ModifiedOn + " TIMESTAMP, "
                                                        + ColumnName_AssignedTo + " INTEGER, "
                                                        + ColumnName_AssignedOn + " TIMESTAMP)";

        public long Id { get; set; }

        public override string GetDbId()
        {
            return Id.ToString();
        }
    }
}