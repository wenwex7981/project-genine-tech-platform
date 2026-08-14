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
      <span className={`group/item relative rounded hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors ${className}`}>
        <span>{text}</span>
        <button onClick={() => startEdit(section, text, index, field)} className="inline-flex ml-2 opacity-60 hover:opacity-100 text-indigo-500 transition-opacity align-middle p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40">
          <Pencil className="h-3 w-3" />
        </button>
      </span>
    );
  };

  const renderSection = (id: string) => {
    if (!data[id] || (Array.isArray(data[id]) && data[id].length === 0)) return null;

    let content = null;
    switch (id) {
      case "summary":
        content = renderEditableText(data.summary, "summary", undefined, undefined, "text-gray-700 dark:text-gray-300 leading-relaxed");
        break;
      case "experience":
        content = data.experience.map((exp: any, i: number) => (
          <div key={exp.id || i} className="mb-6 last:mb-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-lg">{renderEditableText(exp.position, "experience", i, "position")}</h4>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">{renderEditableText(`${exp.startDate} - ${exp.endDate}`, "experience", i, "dates")}</span>
            </div>
            <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium mb-2">
              {renderEditableText(exp.company, "experience", i, "company")} | {renderEditableText(exp.location, "experience", i, "location")}
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {exp.bullets.map((bullet: string, j: number) => (
                <li key={j} className="text-gray-700 dark:text-gray-300 text-sm">
                  {renderEditableText(bullet, "experience", i, `bullet-${j}`)}
                </li>
              ))}
            </ul>
          </div>
        ));
        break;
      case "education":
        content = data.education.map((edu: any, i: number) => (
          <div key={edu.id || i} className="mb-4 last:mb-0">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-lg">{renderEditableText(edu.degree, "education", i, "degree")}</h4>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">{renderEditableText(`${edu.startDate} - ${edu.endDate}`, "education", i, "dates")}</span>
            </div>
            <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium">
              {renderEditableText(edu.institution, "education", i, "institution")} | GPA: {renderEditableText(edu.gpa, "education", i, "gpa")}
            </div>
          </div>
        ));
        break;
      case "projects":
        content = data.projects.map((proj: any, i: number) => (
          <div key={proj.id || i} className="mb-6 last:mb-0">
             <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-lg flex items-center gap-2">
                {renderEditableText(proj.title, "projects", i, "title")}
                {proj.link && <a href={proj.link} target="_blank" className="text-xs text-blue-500 hover:underline">(Link)</a>}
              </h4>
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">
              {renderEditableText(proj.technologies, "projects", i, "technologies")}
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {proj.bullets.map((bullet: string, j: number) => (
                <li key={j} className="text-gray-700 dark:text-gray-300 text-sm">
                  {renderEditableText(bullet, "projects", i, `bullet-${j}`)}
                </li>
              ))}
            </ul>
          </div>
        ));
        break;
      case "skills":
        content = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map((skill: any, i: number) => (
              <div key={skill.id || i}>
                <span className="font-bold text-gray-900 dark:text-gray-100">{skill.category}: </span>
                <span className="text-gray-700 dark:text-gray-300">{skill.items.join(", ")}</span>
              </div>
            ))}
          </div>
        );
        break;
      case "certifications":
        content = data.certifications.map((cert: any, i: number) => (
          <div key={cert.id || i} className="mb-2 last:mb-0 flex justify-between">
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

      <div id="resume-pdf-container" className="bg-white dark:bg-zinc-950 shadow-2xl rounded-xl p-10 print:shadow-none print:p-0">
        {/* Header (Not draggable) */}
        <div className="text-center mb-8 border-b-2 border-gray-100 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            {renderEditableText(data.personalInfo.name, "personalInfo", undefined, "name")}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            <span>{renderEditableText(data.personalInfo.email, "personalInfo", undefined, "email")}</span>
            <span>•</span>
            <span>{renderEditableText(data.personalInfo.phone, "personalInfo", undefined, "phone")}</span>
            <span>•</span>
            <span>{renderEditableText(data.personalInfo.linkedin, "personalInfo", undefined, "linkedin")}</span>
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
