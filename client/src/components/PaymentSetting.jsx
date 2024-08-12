import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api_group_3 } from '@/interceptors/axios';

const PaymentSetting = () => {
  const { siteId } = useParams();
  const [linkedPaymentMethods, setLinkedPaymentMethods] = useState([]);
  const [allPaymentMethods, setAllPaymentMethods] = useState([]);
  const [paymentName, setPaymentName] = useState('');
  const [linkErrorMessages, setLinkErrorMessages] = useState({});
  const [getErrorMessages, setGetErrorMessages] = useState({});
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [selectedUnlinkMethods, setSelectedUnlinkMethods] = useState([]);
  const API_BASE_URL = 'http://127.0.0.1:5000';

  const fetchLinkedPaymentMethods = async () => {
    try {
      const response = await api_group_3.get(`/pmt/spmt/${siteId}`);
      const data = response.data;

      if (data.data.length === 0) {
        setLinkErrorMessages({ message: 'No payment methods found for this site.' });
        setLinkedPaymentMethods([]);
      } else {
        setLinkedPaymentMethods(data.data);
        setLinkErrorMessages({});
      }
    } catch (error) {
      console.error("Error fetching linked payment methods!", error);
      setLinkErrorMessages({ message: 'There was an error fetching the payment methods.' });
    }
  };

  const fetchAllPaymentMethods = async () => {
    try {
      const response = await api_group_3.get(`/pmt`);
      const data = response.data;

      if (data.length === 0) {
        setGetErrorMessages({ message: 'No payment methods found for this application.' });
      } else {
        setAllPaymentMethods(data);
        setGetErrorMessages({});
      }
    } catch (error) {
      console.error("Error fetching available payment methods!", error);
      setGetErrorMessages({ message: 'There was an error fetching the payment methods.' });
    }
  };

  useEffect(() => {
    fetchLinkedPaymentMethods();
    fetchAllPaymentMethods();
  }, [siteId]);

  const handleAddPaymentMethod = async (event) => {
    event.preventDefault();

    if (!paymentName.trim()) {
      alert('Please enter a payment method name.');
      return;
    }

    try {
      const response = await api_group_3.post(`/pmt`, {
        name: paymentName,
      });

      if (response.status === 200) {
        setPaymentName('');
        fetchAllPaymentMethods();
      }
    } catch (error) {
      console.error('Error adding payment method!', error);
      alert(error.response?.data?.message || 'Failed to add payment method.');
    }
  };

  const handleLinkMethod = async () => {
    try {
      await Promise.all(
        selectedMethods.map(async (paymentMethodID) => {
          await api_group_3.post(`/pmt/link`, {
            paymentMethodID,
            siteID: siteId,
          });
        })
      );

      fetchLinkedPaymentMethods();
      setSelectedMethods([]);
    } catch (error) {
      console.error('Error linking payment methods:', error);
    }
  };

  const handleUnlinkMethod = async () => {
    try {
      await Promise.all(
        selectedUnlinkMethods.map(async (paymentMethodID) => {
          await api_group_3.delete(`/pmt/link`, {
            data: {
              paymentMethodID,
              siteID: siteId,
            },
          });
        })
      );

      fetchLinkedPaymentMethods();
      setSelectedUnlinkMethods([]);
    } catch (error) {
      console.error('Error unlinking payment methods:', error);
    }
  };

  const handleCheckboxChangeToLink = (paymentMethodId) => {
    setSelectedMethods((prev) =>
      prev.includes(paymentMethodId)
        ? prev.filter(id => id !== paymentMethodId)
        : [...prev, paymentMethodId]
    );
  };

  const handleCheckboxChangeToUnlink = (paymentMethodId) => {
    setSelectedUnlinkMethods((prev) =>
      prev.includes(paymentMethodId)
        ? prev.filter(id => id !== paymentMethodId)
        : [...prev, paymentMethodId]
    );
  };

  return (
    <div className="payment-setting d-flex flex-column align-items-center vh-100 w-75">
      <h1 className="mt-2 mb-4 font-weight-bold">Payment Settings</h1>

      <div className="card w-50 p-4 mb-3">
        <h3 className="mb-3">Allowed Payment Methods</h3>
        {linkErrorMessages.message ? (
          <div className="text-danger mt-2">{linkErrorMessages.message}</div>
        ) : (
          <ul className="list-group">
            {linkedPaymentMethods.map((method, index) => (
              <li key={index} className="list-group-item">
                <input
                  type="checkbox"
                  id={`paymentMethod-${index}`}
                  value={method.umPaymentMethod.paymentMethodId}
                  checked={selectedUnlinkMethods.includes(method.umPaymentMethod.paymentMethodId)}
                  onChange={() => handleCheckboxChangeToUnlink(method.umPaymentMethod.paymentMethodId)}
                />
                <label htmlFor={`paymentMethod-${index}`} className="ml-2">
                  {method.umPaymentMethod.paymentMethodName}
                </label>
              </li>
            ))}
          </ul>
        )}
        <div className="d-flex justify-content-start mt-3">
          <button type="button" className="btn btn-primary link-payment-button" onClick={handleUnlinkMethod}>
            Unlink Method
          </button>
        </div>
      </div>

      <div className="card w-50 p-4 mb-3">
        <h3 className="mb-3">Available Payment Methods</h3>
        {getErrorMessages.message ? (
          <div className="text-danger mt-2">{getErrorMessages.message}</div>
        ) : (
          <ul className="list-group">
            {allPaymentMethods
              .filter(
                (method) =>
                  !linkedPaymentMethods.some(
                    (linkedMethod) =>
                      linkedMethod.umPaymentMethod.paymentMethodName === method.paymentMethodName
                  )
              )
              .map((method, index) => (
                <li key={index} className="list-group-item">
                  <input
                    type="checkbox"
                    id={`paymentMethod-${index}`}
                    value={method.paymentMethodId}
                    checked={selectedMethods.includes(method.paymentMethodId)}
                    onChange={() => handleCheckboxChangeToLink(method.paymentMethodId)}
                  />
                  <label htmlFor={`paymentMethod-${index}`} className="ml-2">
                    {method.paymentMethodName}
                  </label>
                </li>
              ))}
          </ul>
        )}
        <div className="d-flex justify-content-start mt-3">
          <button type="button" className="btn btn-primary link-payment-button" onClick={handleLinkMethod}>
            Link Method
          </button>
        </div>
      </div>

      <div className="card w-50 p-4">
        <h3 className="mb-3">Add New Payment Methods</h3>
        <form onSubmit={handleAddPaymentMethod}>
          <div className="mb-3">
            <label htmlFor="paymentName" className="form-label">
              Payment Name
            </label>
            <input
              type="text"
              className="form-control"
              id="paymentName"
              placeholder="Enter payment name"
              value={paymentName}
              onChange={(e) => setPaymentName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Method
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentSetting;