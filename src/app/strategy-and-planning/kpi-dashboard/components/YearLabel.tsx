interface YearLabelProps {
    year: string;
}

export function YearLabel(props: YearLabelProps) {
    const { year } = props
    return (
        <p className="text-center border py-2 border-lightTeal bg-offWhite text-slateGreen font-medium">
            Year {year}
        </p>
    )
}