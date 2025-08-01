"use client";

import PageHeader from "@/components/PageHeader";
import { AddCashInSales } from "./components/AddCashInSales";
import { AddCashOut } from "./components/AddCashOut";
import { AddPayroll } from "./components/AddPayroll";
import { AddPrivateIncome } from "./components/AddPrivateIncome";
import { AddSavings } from "./components/AddSavings";
import { AddSpendingOnBudget } from "./components/AddSpendingOnBudget";
import { fetchSiteDropdownOptions, SiteDropdownOption } from "@/services/api/site/fetchSiteDropdownOptions";
import { getFiveYearOptions } from "@/utils/yearUtils";
import { ModalType } from "./types/kpiDashboard.types";
import { PageFilters } from "@/components/PageFilters";
import { useEffect, useState } from "react";
import { useGetKPIDashboardData } from "@/services/query/kpi-dashboard-query/kpi-dashboard.query";
import { KPIDashboardTable } from "./components/KPIDashboardTable";
import { TableEditButton } from "./components/TableEditButton";
import { TableSection } from "./components/TableSection";
import { useStaffTurnoverRatio } from "./hooks/useStaffTurnoverRatio";
import { MODAL_TYPES, TOOLTIP_TEXT } from "./configs/modalConfigs";
import { YearLabel } from "./components/YearLabel";
import {
  cashCollectedTurnover,
  cashInSales,
  cashOut,
  margin,
  payrollRows,
  privateIncomeRows,
  rev,
  savings,
  spendingOnBudget,
  staffToTurnover,
} from "./configs/tableConfigs";

function Page() {
  const { currentYear, yearOptions } = getFiveYearOptions();
  const [siteOptions, setSiteOptions] = useState<SiteDropdownOption[]>([]);
  const [defaultSiteID, setDefaultSiteID] = useState("");
  const [selectedSiteID, setSelectedSiteID] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const { data = [] } = useGetKPIDashboardData(
    {
      selectedSiteID,
      selectedYear,
    },
    !!selectedSiteID, //Fetch KPI Dashboard Data when selectedSiteID is generated.
  );

  const staffTurnoverGrandRatio = useStaffTurnoverRatio(data)

  const closeModal = () => setActiveModal(null);

  const handleReset = () => {
    setSelectedSiteID(defaultSiteID);
    setSelectedYear(currentYear);
  };

  useEffect(() => {
    const loadSites = async () => {
      const options = await fetchSiteDropdownOptions();
      setSiteOptions(options);

      // Optionally set first site ID but do not fetch API yet
      if (options.length > 0) {
        const firstSiteId = options[0].value;
        setDefaultSiteID(firstSiteId);
        setSelectedSiteID(firstSiteId);
      }
    };
    loadSites();
  }, []);

  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col gap-4">
        <PageHeader title="KPI Dashboard">
          <PageFilters
            yearOptions={yearOptions}
            siteOptions={siteOptions}
            selectedSiteID={selectedSiteID}
            selectedYear={selectedYear}
            onSiteChange={setSelectedSiteID}
            onYearChange={setSelectedYear}
            onReset={handleReset}
            onImport={() => { }}
            onExport={() => { }}
          />
        </PageHeader>

        {/*++++++++++++++ Table: Year Label ++++++++++++++*/}
        <YearLabel year={selectedYear} />

        <TableSection>
          <>
            {/*++++++++++++++ Table: Private Income ++++++++++++++*/}
            <TableEditButton
              toolTipText={TOOLTIP_TEXT.EDIT_PRIVATE_INCOME}
              onClickHandler={() => setActiveModal(MODAL_TYPES.PRIVATE_INCOME)}
            />
            <KPIDashboardTable data={data} rows={privateIncomeRows} showGrandTotal={true} />

            {/*++++++++++++++ Table: Payroll ++++++++++++++*/}
            <TableEditButton
              toolTipText={TOOLTIP_TEXT.EDIT_PAYROLL}
              onClickHandler={() => setActiveModal(MODAL_TYPES.PAYROLL)}
            />
            <KPIDashboardTable
              data={data}
              rows={payrollRows}
              showHeaders={false}
              showGrandTotal={true}
            />

            {/*++++++++++++++ Table: Staff To Turnover ++++++++++++++*/}
            <KPIDashboardTable
              data={data}
              rows={staffToTurnover}
              showHeaders={false}
              showGrandTotal={true}
              grandTotalLabel="Grand Ratio"
              grandTotal={staffTurnoverGrandRatio}
            />
          </>
        </TableSection>

        <TableSection>
          <>
            {/*++++++++++++++ Table: Cash In Sales ++++++++++++++*/}
            <TableEditButton
              toolTipText={TOOLTIP_TEXT.EDIT_CASH_IN_SALES}
              onClickHandler={() => setActiveModal(MODAL_TYPES.CASH_IN_SALES)}
            />
            <KPIDashboardTable
              data={data}
              rows={cashInSales} />

            {/*++++++++++++++ Table: Cash Out ++++++++++++++*/}
            <TableEditButton
              toolTipText={TOOLTIP_TEXT.EDIT_CASH_OUT}
              onClickHandler={() => setActiveModal(MODAL_TYPES.CASH_OUT)}
            />
            <KPIDashboardTable
              data={data}
              rows={cashOut}
              showHeaders={false} />

            {/*++++++++++++++ Table: Spending On Budget ++++++++++++++*/}
            <TableEditButton
              toolTipText={TOOLTIP_TEXT.EDIT_TOTAL_SPEND}
              onClickHandler={() => setActiveModal(MODAL_TYPES.SPENDING_ON_BUDGET)}
            />
            <KPIDashboardTable
              data={data}
              rows={spendingOnBudget}
              showHeaders={false}
            />

            {/*++++++++++++++ Table: Savings ++++++++++++++*/}
            <TableEditButton
              toolTipText={TOOLTIP_TEXT.EDIT_SAVINGS}
              onClickHandler={() => setActiveModal(MODAL_TYPES.SAVINGS)}
            />
            <KPIDashboardTable
              data={data} rows={savings}
              showHeaders={false}
              showGrandTotal={true}
              rowToSumLabel={"Profit/Loss"} />

            {/*++++++++++++++ Table: REV and Difference ++++++++++++++*/}
            <KPIDashboardTable
              data={data}
              rows={rev}
              showHeaders={false} />

            {/*++++++++++++++ Table: Margin ++++++++++++++*/}
            <KPIDashboardTable
              data={data}
              rows={margin}
              showHeaders={false} />

            {/*++++++++++++++ Table: Cash Collected Turnover ++++++++++++++*/}
            <KPIDashboardTable
              data={data}
              rows={cashCollectedTurnover}
              showHeaders={false}
            />
          </>
        </TableSection>

        {/*++++++++++++++ Modals For Various Entries ++++++++++++++*/}
        <AddPrivateIncome
          siteID={selectedSiteID}
          year={selectedYear}
          isOpen={activeModal === MODAL_TYPES.PRIVATE_INCOME}
          onOpenChange={closeModal}
        />

        <AddPayroll
          siteID={selectedSiteID}
          year={selectedYear}
          isOpen={activeModal === MODAL_TYPES.PAYROLL}
          onOpenChange={closeModal}
        />

        <AddCashInSales
          siteID={selectedSiteID}
          year={selectedYear}
          isOpen={activeModal === MODAL_TYPES.CASH_IN_SALES}
          onOpenChange={closeModal}
        />

        <AddCashOut
          siteID={selectedSiteID}
          year={selectedYear}
          isOpen={activeModal === MODAL_TYPES.CASH_OUT}
          onOpenChange={closeModal}
        />

        <AddSpendingOnBudget
          siteID={selectedSiteID}
          year={selectedYear}
          isOpen={activeModal === MODAL_TYPES.SPENDING_ON_BUDGET}
          onOpenChange={closeModal}
        />

        <AddSavings
          siteID={selectedSiteID}
          year={selectedYear}
          isOpen={activeModal === MODAL_TYPES.SAVINGS}
          onOpenChange={closeModal}
        />
      </article>
    </main>
  );
}
export default Page;
