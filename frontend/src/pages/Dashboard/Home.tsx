import React, { useState, useRef } from 'react';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import RideModal from '../../components/RideModal/RideModal';
import ScheduledTable from '../../components/UserTables/ScheduledTable';
import UnscheduledTable from '../../components/UserTables/UnscheduledTable';
import Schedule from '../../components/Schedule/Schedule';
import MiniCal from '../../components/MiniCal/MiniCal';
import Toast from '../../components/ConfirmationToast/ConfirmationToast';
import Notification from '../../components/Notification/Notification';
import styles from './page.module.css';
import { useEmployees } from '../../context/EmployeesContext';
import { useRiders } from '../../context/RidersContext';
import ExportButton from '../../components/ExportButton/ExportButton';
import { useReq } from '../../context/req';
import { useDate } from '../../context/date';
import Collapsible from '../../components/Collapsible/Collapsible';
import { NewRider } from '../../types/index';

const Home = () => {
  const { drivers } = useEmployees();
  const { riders } = useRiders();
  const { withDefaults } = useReq();

  const [downloadData, setDownloadData] = useState<string>('');
  const [showingToast, setToast] = useState(false);
  const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);
  const { curDate } = useDate();
  const today = moment(curDate).format('YYYY-MM-DD');

  const downloadCSV = () => {
    setToast(false);
    fetch(`/api/rides/download?date=${today}`, withDefaults())
      .then((res) => res.text())
      .then((data) => {
        if (data === '') {
          setDownloadData('Name,Pick Up,From,To,Drop Off,Needs,Driver');
        } else {
          setDownloadData(data);
        }
        if (csvLink.current) {
          csvLink.current.link.click();
        }
      })
      .then(() => setToast(true));
  };

  const renderScheduledRides = (): JSX.Element[] => {
    return riders.map((rider: NewRider, index: number) => (
      <ScheduledTable
        key={index}
        query='rider'
        id={rider.id}
        name={`${rider.firstName} ${rider.lastName}`}
      />
    ))
  };

  return (
    <div>
      <div className={styles.pageTitle}>
        <MiniCal />
        {showingToast ? <Toast message={`${today} data has been downloaded.`} /> : null}
        <div className={styles.rightSection}>
          <ExportButton onClick={downloadCSV} />
          <CSVLink
            data={downloadData}
            filename={`scheduledRides_${today}.csv`}
            className="hidden"
            ref={csvLink}
            target="_blank"
          />
          <RideModal />
          <Notification />
        </div>
      </div>

      <Schedule />

      <Collapsible title={'Unscheduled Rides'}>
        <UnscheduledTable drivers={drivers} />
      </Collapsible>

      <Collapsible title={'Scheduled Rides'}>
        {renderScheduledRides()}
      </Collapsible>
    </div >
  );
};

export default Home;
