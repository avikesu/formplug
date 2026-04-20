import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import { StatsCard } from "../../page";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ElementsType } from "@/components/FormElements";
import { formatDistance } from "date-fns";
import { ReactNode } from "react";
import { parseFormElements, parseSubmissionValues } from "@/lib/forms";

async function FormDetailPage(props: { params: Promise<{ id: string }> }) {
  //throw new Error('Test error page');
  const { id } = await props.params;

  if (!id) {
    throw new Error("Missing route param");
  }
  const formId = Number(id);
  if (Number.isNaN(formId)) {
    throw new Error(`Invalid route param: ${formId}`);
  }
  const form = await GetFormById(formId);
  if (!form) {
    throw new Error("Form not found");
  }

  const { visits, submissions } = form;

  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Total Visits"
          helperText="All time form visits"
          value={visits.toLocaleString() || ""}
          icon={<LuView className="text-blue-600" />}
          loading={false}
          className="shadow-md shadow-blue-600"
        />
        <StatsCard
          title="Total Submissions"
          helperText="All time form submissions"
          value={submissions.toLocaleString() || ""}
          icon={<FaWpforms className="text-yellow-600" />}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard
          title="Submission Rate"
          helperText="Visits that result in form submissions"
          value={submissionRate.toLocaleString() + "%" || ""}
          icon={<HiCursorClick className="text-green-600" />}
          loading={false}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="Bounce Rate"
          helperText="Visits that leaves without interacting"
          value={bounceRate.toLocaleString() + "%" || ""}
          icon={<TbArrowBounce className="text-red-600" />}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="conatainer pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
}

export default FormDetailPage;

type Row = {
  values: Record<string, string>;
  submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) {
    throw new Error("Form not found");
  }

  const formElements = parseFormElements(form.content);
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
        const label =
          typeof element.properties?.label === "string"
            ? element.properties.label
            : "Untitled field";
        const required =
          typeof element.properties?.required === "boolean"
            ? element.properties.required
            : false;

        columns.push({
          id: element.id,
          label,
          required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];
  form.FormSubmissions.forEach((submission) => {
    const content = parseSubmissionValues(submission.content);
    rows.push({
      values: content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                Submitted At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    value={row.values[column.id] ?? ""}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ value }: { value: string }) {
  const node: ReactNode = value;
  return <TableCell>{node}</TableCell>;
}
