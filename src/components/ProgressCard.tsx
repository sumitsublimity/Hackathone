import { Ellipsis, SquareCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProgressCardProps {
  title: string;
  progressBarClassName: string;
  denominator: number;
  numerator: number;
}

function ProgressCard(props: ProgressCardProps) {
  const { title, progressBarClassName, numerator, denominator } = props;
  const progressValue = Number(((numerator / denominator) * 100).toFixed(0));
  return (
    <Card className="w-full bg-offWhite shadow hover:shadow-md">
      {/*++++++++++++++ Progress Header ++++++++++++++  */}
      <CardHeader>
        <CardTitle>
          <div className="flex items-center w-full justify-between mb-1">
            <h3 className="font-bold text-darkGreen">{title}</h3>
            <Ellipsis />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/*++++++++++++++ Progress Label ++++++++++++++  */}
        <div className="flex w-full justify-between mb-2">
          <h3 className="text-sm text-lightSlateGreen flex">Progress</h3>
          <h3 className="text-sm font-medium text-black">{progressValue}%</h3>
        </div>

        {/*++++++++++++++ Progress Line ++++++++++++++  */}
        <Progress
          className="bg-lightGray"
          value={progressValue}
          indicatorClassName={progressBarClassName}
        />

        {/*++++++++++++++ Progress Footer ++++++++++++++  */}
        <div className="flex mt-3 items-center gap-11">
          <div className="flex">
            <SquareCheck className="text-[var(--btn-darkGray)]" />
            <h3 className="text-sm flex ms-2">
              <span className="text-black">{numerator}</span>
              <span className="text-lightSlateGreen">/{denominator}</span>
            </h3>
          </div>
          <div className="flex relative justify-end">
            <Avatar>
              <AvatarImage src="/icons/Avatar.svg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="absolute right-[-1.7vw]">
              <AvatarImage src="/icons/Avatar.svg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="absolute right-[-3vw] w-10 h-10 grid place-content-center shadow rounded-full bg-iceBlue text-blue-900">
              +2
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ProgressCard;
