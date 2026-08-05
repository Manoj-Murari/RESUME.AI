import React from "react";
import { ResumeData, TemplateId } from "../../types/resume";
import { JakeFaangTemplate } from "./JakeFaangTemplate";
import { AustereTemplate } from "./AustereTemplate";
import { ModernSplitTemplate } from "./ModernSplitTemplate";
import { AlexWebbTemplate } from "./AlexWebbTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";

interface Props {
  templateId: TemplateId;
  data: ResumeData;
  editable?: boolean;
  onUpdateData?: (newData: Partial<ResumeData>) => void;
}

export const TemplateRenderer: React.FC<Props> = ({
  templateId,
  data,
  editable = true,
  onUpdateData,
}) => {
  switch (templateId) {
    case "jake-faang":
      return <JakeFaangTemplate data={data} editable={editable} onUpdateData={onUpdateData} />;
    case "austere":
      return <AustereTemplate data={data} editable={editable} onUpdateData={onUpdateData} />;
    case "modern-split":
      return <ModernSplitTemplate data={data} editable={editable} onUpdateData={onUpdateData} />;
    case "alex-webb":
      return <AlexWebbTemplate data={data} editable={editable} onUpdateData={onUpdateData} />;
    case "executive":
      return <ExecutiveTemplate data={data} editable={editable} onUpdateData={onUpdateData} />;
    default:
      return <JakeFaangTemplate data={data} editable={editable} onUpdateData={onUpdateData} />;
  }
};
