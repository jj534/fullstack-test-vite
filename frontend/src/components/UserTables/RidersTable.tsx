import React, { useEffect, Dispatch, SetStateAction } from 'react';
import TableRow from '../TableComponents/TableRow';
import { AccessibilityNeeds, Rider } from '../../types';
import styles from './table.module.css';

type RidersTableProps = {
  riders: Array<Rider>;
  setRiders: Dispatch<SetStateAction<Rider[]>>;
}

function renderTableHeader() {
  return (
    <tr>
      <th className={styles.tableHeader}>First Name</th>
      <th className={styles.tableHeader}>Last Name</th>
      <th className={styles.tableHeader}>Phone Number</th>
      <th className={styles.tableHeader}>Email</th>
      <th className={styles.tableHeader}>Accessibility Needs</th>
    </tr>
  );
}

function renderAccessNeeds(accessNeeds: Array<string>) {
  let allNeeds = '';
  if (accessNeeds != null) {
    for (let i = 0; i < accessNeeds.length; i += 1) {
      allNeeds += accessNeeds[i];
    }
    return allNeeds;
  }
  return null;
}

const RidersTable = ({ riders, setRiders }: RidersTableProps) => {
  useEffect(() => {
    async function getExistingRiders() {
      const ridersData = await fetch('/riders')
        .then((res) => res.json())
        .then((data) => data.data);

      const allRiders: Rider[] = ridersData.map((rider: any) => ({
        id: rider.id,
        firstName: rider.firstName,
        lastName: rider.lastName,
        phoneNumber: rider.phoneNumber,
        email: rider.email,
        accessibilityNeeds: rider.accessibilityNeeds,
        description: rider.description,
        joinDate: rider.joinDate,
        pronouns: rider.pronouns,
        address: rider.address,
      }));
      setRiders(allRiders);
    }
    getExistingRiders();
  }, [setRiders]);

  function deleteEntry(email: string, riderList: Rider[]) {
    const riderId = (riderList.filter((rider) => rider.email === email))[0].id;
    async function deleteBackend() {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      };
      await fetch(`/riders/${riderId}`, requestOptions);
    }
    deleteBackend();
    return riderList.filter((rider) => rider.email !== email);
  }

  function renderTableData(allRiders: Rider[]) {
    return allRiders.map((rider, index) => {
      const {
        firstName, lastName, phoneNumber, email, accessibilityNeeds,
      } = rider;
      const buttonText = 'Delete';
      const valueFName = { data: firstName };
      const valueLName = { data: lastName };
      const valuePhone = { data: phoneNumber };
      const valueEmail = { data: email };
      const valueAccessbility = { data: renderAccessNeeds(accessibilityNeeds) };
      const valueDelete = {
        data: buttonText,
        buttonHandler: () => setRiders(deleteEntry(email, allRiders)),
      };
      const inputValues = [valueFName, valueLName, valuePhone, valueEmail,
        valueAccessbility, valueDelete];
      return (
        <tr key={index}>
          <TableRow values={inputValues} />
        </tr>
      );
    });
  }

  return (
    <>
      <div>
        <h1 className={styles.formHeader}>Riders</h1>
        <table cellSpacing='0' className={styles.table}>
          <tbody>
            {renderTableHeader()}
            {renderTableData(riders)}
          </tbody>
        </table>
      </div >
    </>
  );
};

export default RidersTable;
