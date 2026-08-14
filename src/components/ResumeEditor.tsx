"use client";

import React, { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Download, Check, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateDocx, generatePdf } from "@/lib/exportResume";

interface SectionProps {
  id: string;
  title: string;
  content: React.ReactNode;
  onEdit: () => void;
}

const SortableSection = ({ id, title, content, onEdit }: SectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group bg-white dark:bg-zinc-900 mb-6 p-6 rounded-xl border border-transparent hover:border-indigo-500/30 hover:shadow-lg transition-all">
      <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-gray-400 hover:text-indigo-500" />
      </div>
      <div className="pl-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b-2 border-indigo-500 pb-1">{title}</h3>
          <button onClick={onEdit} className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-indigo-500 transition-opacity rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
            <Pencil className="h-4 w-4" />
          </button>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default function ResumeEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [sections, setSections] = useState(["summary", "experience", "education", "projects", "skills", "certifications"]);
  const [editingField, setEditingField] = useState<{section: string, index?: number, field?: string} | null>(null);
  const [editValue, setEditValue] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const startEdit = (section: string, value: string, index?: number, field?: string) => {
    setEditingField({ section, index, field });
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editingField) return;
    const { section, index, field } = editingField;
    
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (index !== undefined && field) {
        newData[section][index][field] = editValue;
      } else if (index !== undefined) {
        // e.g. bullet points or simple arrays
        newData[section][index] = editValue;
      } else {
        newData[section] = editValue;
      }
      return newData;
    });
    setEditingField(null);
  };

  const renderEditableText = (text: string, section: string, index?: number, field?: string, className: string = "") => {
    const isEditing = editingField?.section === section && editingField?.index === index && editingField?.field === field;
    
    if (isEditing) {
      return (
        <div className="flex items-start gap-2 my-1">
          <textarea 
            className="w-full p-2 border rounded-md dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 min-h-[60px]"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
          <div className="flex flex-col gap-1">
            <button onClick={saveEdit} className="p-1 bg-green-500 text-white rounded"><Check className="h-4 w-4"/></button>
            <button onClick={() => setEditingField(null)} className="p-1 bg-red-500 text-white rounded"><X className="h-4 w-4"/></button>
          </div>
        </div>
      );
    }

    return (
      <span className={`group/item relative transition-colors ${className}`}>
        <span>{text}</span>
        <button onClick={() => startEdit(section, text, index, field)} className="inline-flex ml-1 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 text-indigo-500 transition-opacity align-middle p-1 rounded hover:bg-indigo-100 print:hidden">
          <Pencil className="h-3 w-3" />
        </button>
      </span>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="uppercase font-bold font-serif text-[14px] border-b-[1.5px] border-black pb-0.5 mb-2 mt-4 tracking-wide text-black">
      {title}
    </h3>
  );

  const renderSection = (id: string) => {
    if (!data[id] || (Array.isArray(data[id]) && data[id].length === 0)) return null;

    let content = null;
    switch (id) {
      case "summary":
        content = (
          <div>
            <SectionHeader title="Professional Summary" />
            <div className="font-serif text-[13px] leading-snug text-black text-justify">
              {renderEditableText(data.summary, "summary")}
            </div>
          </div>
        );
        break;
      case "experience":
        content = (
          <div>
            <SectionHeader title="Experience" />
            {data.experience.map((exp: any, i: number) => (
              <div key={exp.id || i} className="mb-3 last:mb-0 font-serif text-[13px] leading-snug text-black">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold">{renderEditableText(exp.position, "experience", i, "position")}</h4>
                  <span className="italic">{renderEditableText(exp.company, "experience", i, "company")} | {renderEditableText(`${exp.startDate} - ${exp.endDate}`, "experience", i, "dates")}</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 mt-1">
                  {exp.bullets.map((bullet: string, j: number) => (
                    <li key={j} className="pl-1">
                      {renderEditableText(bullet, "experience", i, `bullet-${j}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;
      case "education":
        content = (
          <div>
            <SectionHeader title="Education" />
            {data.education.map((edu: any, i: number) => (
              <div key={edu.id || i} className="mb-3 last:mb-0 font-serif text-[13px] leading-snug text-black">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold">{renderEditableText(`${edu.degree} in ${edu.institution}`, "education", i, "degree")}</h4>
                  <span className="italic">{renderEditableText(`${edu.startDate} - ${edu.endDate}`, "education", i, "dates")}</span>
                </div>
                {edu.gpa && (
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span>{renderEditableText(edu.institution, "education", i, "institution")}</span>
                    <span className="font-bold">CGPA: {renderEditableText(edu.gpa, "education", i, "gpa")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        break;
      case "projects":
        content = (
          <div>
            <SectionHeader title="Projects" />
            {data.projects.map((proj: any, i: number) => (
              <div key={proj.id || i} className="mb-3 last:mb-0 font-serif text-[13px] leading-snug text-black">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold">{renderEditableText(proj.title, "projects", i, "title")}</h4>
                  <span className="italic">{renderEditableText(proj.technologies, "projects", i, "technologies")}</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 mt-1">
                  {proj.bullets.map((bullet: string, j: number) => (
                    <li key={j} className="pl-1">
                      {renderEditableText(bullet, "projects", i, `bullet-${j}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;
      case "skills":
        content = (
          <div>
            <SectionHeader title="Skills" />
            <div className="font-serif text-[13px] leading-snug text-black space-y-1">
              {data.skills.map((skill: any, i: number) => (
                <div key={i}>
                  <span className="font-bold">{renderEditableText(skill.category, "skills", i, "category")}: </span>
                  <span>{renderEditableText(skill.items.join(", "), "skills", i, "items")}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      case "certifications":
            <div>
              <span className="font-bold">{renderEditableText(cert.title, "certifications", i, "title")}</span> - {renderEditableText(cert.issuer, "certifications", i, "issuer")}
            </div>
            <span className="text-sm text-gray-500">{renderEditableText(cert.date, "certifications", i, "date")}</span>
          </div>
        ));
        break;
    }

    return <SortableSection key={id} id={id} title={id} content={content} onEdit={() => {}} />;
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Your AI Resume</h2>
          <p className="text-sm text-gray-500">Drag sections to reorder. Click pencil to edit.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={async () => {
            try {
              await generateDocx(data);
            } catch (err: any) {
              alert("Failed to generate Word document: " + err.message);
              console.error(err);
            }
          }} className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
            <FileText className="h-4 w-4" /> Word (.docx)
          </Button>
          <Button onClick={async () => {
            try {
              await generatePdf("resume-pdf-container", data.personalInfo?.name || "Resume");
            } catch (err: any) {
              alert("Failed to generate PDF: " + err.message);
              console.error(err);
            }
          }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-pdf-container, #resume-pdf-container * {
            visibility: visible;
          }
          #resume-pdf-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}} />

      <div id="resume-pdf-container" className="bg-white shadow-2xl rounded-xl px-12 py-10 max-w-[210mm] mx-auto min-h-[297mm]">
        {/* Header (Not draggable) */}
        <div className="text-center mb-4">
          <h1 className="text-[26px] font-bold font-serif uppercase tracking-widest text-black mb-1">
            {renderEditableText(data.personalInfo.name, "personalInfo", undefined, "name")}
          </h1>
          <div className="font-serif text-[13px] text-black mb-1">
            {renderEditableText(data.personalInfo.title || "Professional", "personalInfo", undefined, "title")}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-1.5 font-serif text-[12px] text-black">
            <span>{renderEditableText(data.personalInfo.phone || "+91 0000000000", "personalInfo", undefined, "phone")}</span>
            <span>|</span>
            <span>{renderEditableText(data.personalInfo.email, "personalInfo", undefined, "email")}</span>
            <span>|</span>
            <span>{renderEditableText(data.personalInfo.linkedin || "LinkedIn", "personalInfo", undefined, "linkedin")}</span>
            <span>|</span>
            <span>{renderEditableText(data.personalInfo.github || "GitHub", "personalInfo", undefined, "github")}</span>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections} strategy={verticalListSortingStrategy}>
            {sections.map(id => renderSection(id))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
