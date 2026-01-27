import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/ordersInvoiceDetailLayer.css";
import customerapiProvider from "../apiProvider/customerorderapi";

function OrdersInvoiceDetailPosLayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [orderStatus, setOrderStatus] = useState();
    const [paymentStatus, setPaymentStatus] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            console.log("Order ID:", id);
            fetchData(id);
        }
    }, [id]);
    const fetchData = async (id) => {
        try {
            setLoading(true);
            const result = await customerapiProvider.orderDetails(id);
            console.log("Order Details:", result);
            if (result?.status) {
                setOrderData(result.response.data);
                setOrderStatus(result.response.data.status);
                setPaymentStatus(result.response.data.paymentStatus);
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };
    console.log("Order Data:", orderData);
    if (loading) {
        return <div className="text-center mt-5">Loading order details...</div>;
    }
    console.log("Order Status:", orderStatus);
    console.log("Payment Status:", paymentStatus);

    // Format date to display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await customerapiProvider.updateOrderStatus(
                id,
                orderStatus,
                paymentStatus
            );

            if (result.status) {
                console.log("Order status updated successfully");
                navigate("/pos-order");
            } else {
                console.log("Failed to update order status");
            }
        } catch (error) {
            console.error("Error while updating:", error);
        }
    };
    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body">
                                <article className="order-tracker ">
                                    {/* Order Info */}
                                    <section className=" order-info d-flex justify-content-evenly mb-4">
                                        <div className="order-info__number  text-sm text-muted mb-2">
                                            <span className="me-4 text-md ">
                                                ORDER<span></span>{" "}
                                            </span>
                                            <a
                                                href="/"
                                                className="order-number__numbers text-md fw-semibold"
                                            >
                                                {orderData.orderCode}
                                            </a>
                                        </div>
                                        <div className="order-info__details text-sm">
                                            {/* <div className="order-info__details__arrival-date mb-1">
                        Expected Arrival:{" "}
                        <span className="fw-semibold">01/13/18</span>
                      </div>
                      <div className="order-info__details__tracking-number">
                        USPS:{" "}
                        <a href="/" className="text-tracking-number">
                          24339482904809482
                        </a>
                      </div> */}
                                        </div>
                                    </section>

                                    {/* Progress Bar */}
                                    {/* Progress Bar */}
                                    <section className="order-status__progress mb-4 mt-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 562.4 38.21"
                                            className="w-full h-auto"
                                        >
                                            <title>progress-bar</title>

                                            {/* Background path */}
                                            <path
                                                className="fill-muted"
                                                d="M551.34,4.89A19,19,0,0,0,535,14.22H358.34a19,19,0,0,0-32.67,0H200.12a19,19,0,0,0-32.67,0H43.34a19,19,0,1,0-.4,20H167.85a19,19,0,0,0,31.86,0H326.08a19,19,0,0,0,31.86,0H535.41A19,19,0,1,0,551.34,4.89Z"
                                                transform="translate(-8.01 -4.87)"
                                            />

                                            {/* Connecting line */}
                                            <line
                                                className="stroke-muted-400"
                                                x1="8.98"
                                                y1="19.47"
                                                x2="554.76"
                                                y2="19.47"
                                            />

                                            {/* Steps */}
                                            {["pending", "packed", "shipped", "delivered"].map(
                                                (step, i) => {
                                                    const coords = [
                                                        [19.06, 19.13],
                                                        [175.8, 19.21],
                                                        [334.04, 19.06],
                                                        [543.4, 19],
                                                    ];
                                                    const polyCoords = [
                                                        [
                                                            [15.34, 17.83],
                                                            [19.04, 21.68],
                                                            [27.45, 12.46],
                                                        ],
                                                        [
                                                            [172.08, 17.91],
                                                            [175.78, 21.76],
                                                            [184.18, 12.54],
                                                        ],
                                                        [
                                                            [330.31, 17.76],
                                                            [334.02, 21.61],
                                                            [342.42, 12.39],
                                                        ],
                                                        [
                                                            [539.68, 17.7],
                                                            [543.38, 21.55],
                                                            [551.78, 12.33],
                                                        ],
                                                    ];
                                                    const pathD = [
                                                        "M36.75,24a9.67,9.67,0,1,1-5.91-8.92",
                                                        "M193.49,24.08a9.67,9.67,0,1,1-5.91-8.92",
                                                        "M351.73,23.93A9.67,9.67,0,1,1,345.82,15",
                                                        "M561.09,23.87a9.67,9.67,0,1,1-5.91-8.92",
                                                    ];

                                                    // Determine if step is completed
                                                    const statusOrder = [
                                                        "pending",
                                                        "packed",
                                                        "shipped",
                                                        "delivered",
                                                    ];
                                                    const currentStatusIndex = statusOrder.indexOf(
                                                        orderData.status
                                                    );
                                                    const isCompleted = i < currentStatusIndex;
                                                    const isCurrent = i === currentStatusIndex;

                                                    return (
                                                        <g key={step}>
                                                            {/* Outer circle (bubble) */}
                                                            <circle
                                                                className={
                                                                    isCurrent
                                                                        ? "fill-primary"
                                                                        : isCompleted
                                                                            ? "fill-primary"
                                                                            : "fill-muted"
                                                                }
                                                                cx={coords[i][0]}
                                                                cy={coords[i][1]}
                                                                r="19"
                                                            />

                                                            {/* Step label (optional) */}
                                                            <text
                                                                x={coords[i][0]}
                                                                y={coords[i][1] + 40}
                                                                textAnchor="middle"
                                                                className="text-xs font-medium fill-foreground"
                                                            >
                                                                {step}
                                                            </text>

                                                            {/* Show checkmark for completed steps */}
                                                            {isCompleted && (
                                                                <g>
                                                                    {/* Circular check stroke */}
                                                                    <path
                                                                        className="stroke-primary-foreground"
                                                                        d={pathD[i]}
                                                                        transform="translate(-8.01 -4.87)"
                                                                        fill="none"
                                                                        strokeWidth="2"
                                                                    />
                                                                    {/* Checkmark */}
                                                                    <polyline
                                                                        className="stroke-primary-foreground"
                                                                        points={polyCoords[i]
                                                                            .map((p) => p.join(" "))
                                                                            .join(" ")}
                                                                        fill="none"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </g>
                                                            )}

                                                            {/* Show current step indicator */}
                                                            {isCurrent && (
                                                                <circle
                                                                    cx={coords[i][0]}
                                                                    cy={coords[i][1]}
                                                                    r="8"
                                                                    className=""
                                                                    style={{ fill: "white" }}
                                                                />
                                                            )}
                                                        </g>
                                                    );
                                                }
                                            )}
                                        </svg>
                                    </section>
                                    <section className="order-status__status-info  ">
                                        <ol className="order-details flex  justify-between items-start gap-4">
                                            <li className="order-status__status-info__step flex flex-col items-center text-center flex-1">
                                                <div className="icon w-6 h-6 ">
                                                    {/* Order Placed Icon */}
                                                    <svg
                                                        version="1.1"
                                                        id="Capa_1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        x="0px"
                                                        y="0px"
                                                        viewBox="0 0 512 512"
                                                        fill="currentColor"
                                                        className="w-6 h-6"
                                                        style={{ width: "24px", height: "24px" }}
                                                    >
                                                        {/* All <path> elements go here. Remove any inline styles or class attributes that conflict. */}
                                                        <g>
                                                            <g>
                                                                <path
                                                                    d="M400.292,32.064h-48.613v-5.276c0-12.572-18.105-17.987-31.724-20.966C302.789,2.068,280.076,0,256,0
          s-46.789,2.068-63.954,5.823c-13.619,2.979-31.724,8.394-31.724,20.966v5.276h-48.613c-21.816,0-39.564,17.749-39.564,39.565
          v400.806c0,21.816,17.749,39.564,39.564,39.564H400.29c21.816,0,39.564-17.749,39.564-39.564V71.629
          C439.856,49.813,422.107,32.064,400.292,32.064z M175.324,27.751C179.771,23.209,207.419,15,256,15
          c48.582,0,76.229,8.209,80.677,12.751v35.862c0,0.285-0.231,0.516-0.516,0.516H175.839c-0.285,0-0.516-0.232-0.516-0.516V27.751z
          M400.292,497H111.709c-13.545,0-24.564-11.02-24.564-24.564V71.629c0-13.545,11.02-24.565,24.564-24.565h48.613v16.548
          c0,8.556,6.96,15.516,15.516,15.516h160.322c8.556,0,15.516-6.961,15.516-15.516V47.064h48.613
          c13.545,0,24.564,11.02,24.564,24.565v400.807h0.002C424.856,485.981,413.836,497,400.292,497z"
                                                                />
                                                            </g>
                                                        </g>

                                                        {/* You can keep or remove individual groups as needed */}
                                                        {/* Repeat the pattern with each <g> and <path>, like below */}
                                                        <g>
                                                            <g>
                                                                <path d="..." />
                                                            </g>
                                                        </g>
                                                        {/* ...more paths */}
                                                    </svg>
                                                </div>
                                                <div className="status text-xs leading-tight">
                                                    <span className="text-muted-foreground block">
                                                        Order
                                                    </span>
                                                    <span className="text-foreground font-semibold block">
                                                        Placed
                                                    </span>
                                                </div>
                                            </li>

                                            <li className="order-status__status-info__step flex flex-col items-center text-center flex-1">
                                                <div className="icon w-6 h-6 text-success-600">
                                                    {/* Packed Icon */}
                                                    <svg
                                                        viewBox="0 0 512 512"
                                                        // fill=''
                                                        className="w-6 h-6"
                                                        style={{ width: "24px", height: "24px" }}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <g>
                                                            <g>
                                                                <path
                                                                    d="M491.729,112.971L259.261,0.745c-2.061-0.994-4.461-0.994-6.521,0L20.271,112.971c-2.592,1.251-4.239,3.876-4.239,6.754
          v272.549c0,2.878,1.647,5.503,4.239,6.754l232.468,112.226c1.03,0.497,2.146,0.746,3.261,0.746s2.23-0.249,3.261-0.746
          l232.468-112.226c2.592-1.251,4.239-3.876,4.239-6.754V119.726C495.968,116.846,494.32,114.223,491.729,112.971z M256,15.828
          l215.217,103.897l-62.387,30.118c-0.395-0.301-0.812-0.579-1.27-0.8L193.805,45.853L256,15.828z M176.867,54.333l214.904,103.746
          l-44.015,21.249L132.941,75.624L176.867,54.333z M396.799,172.307v78.546l-41.113,19.848v-78.546L396.799,172.307z
          M480.968,387.568L263.5,492.55V236.658l51.873-25.042c3.73-1.801,5.294-6.284,3.493-10.015
          c-1.801-3.729-6.284-5.295-10.015-3.493L256,223.623l-20.796-10.04c-3.731-1.803-8.214-0.237-10.015,3.493
          c-1.801,3.73-0.237,8.214,3.493,10.015l19.818,9.567V492.55L31.032,387.566V131.674l165.6,79.945
          c1.051,0.508,2.162,0.748,3.255,0.748c2.788,0,5.466-1.562,6.759-4.241c1.801-3.73,0.237-8.214-3.493-10.015l-162.37-78.386
          l74.505-35.968L340.582,192.52c0.033,0.046,0.07,0.087,0.104,0.132v89.999c0,2.581,1.327,4.98,3.513,6.353
          c1.214,0.762,2.599,1.147,3.988,1.147c1.112,0,2.227-0.247,3.26-0.746l56.113-27.089c2.592-1.251,4.239-3.875,4.239-6.754v-90.495
          l69.169-33.392V387.568z"
                                                                />
                                                            </g>
                                                        </g>
                                                        <g>
                                                            <g>
                                                                <path
                                                                    d="M92.926,358.479L58.811,342.01c-3.732-1.803-8.214-0.237-10.015,3.493c-1.801,3.73-0.237,8.214,3.493,10.015
          l34.115,16.469c1.051,0.508,2.162,0.748,3.255,0.748c2.788,0,5.466-1.562,6.759-4.241
          C98.22,364.763,96.656,360.281,92.926,358.479z"
                                                                />
                                                            </g>
                                                        </g>
                                                        <g>
                                                            <g>
                                                                <path
                                                                    d="M124.323,338.042l-65.465-31.604c-3.731-1.801-8.214-0.237-10.015,3.494c-1.8,3.73-0.236,8.214,3.494,10.015
          l65.465,31.604c1.051,0.507,2.162,0.748,3.255,0.748c2.788,0,5.466-1.562,6.759-4.241
          C129.617,344.326,128.053,339.842,124.323,338.042z"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </div>
                                                <div className="status text-xs leading-tight">
                                                    <span className="text-muted-foreground block">
                                                        Order
                                                    </span>
                                                    <span className="text-foreground font-semibold block">
                                                        Packed
                                                    </span>
                                                </div>
                                            </li>

                                            <li className="order-status__status-info__step flex flex-col items-center text-center flex-1">
                                                <div className="icon w-6 h-6 text-success-600">
                                                    {/* Shipped Icon */}
                                                    <svg
                                                        version="1.1"
                                                        viewBox="0 0 512 512"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-6 h-6 fill-current"
                                                        style={{ width: "24px", height: "24px" }}
                                                    >
                                                        <g>
                                                            <g>
                                                                <path d="M111.709,344.693c-8.556,0-15.516,6.96-15.516,15.516c0,8.556,6.96,15.516,15.516,15.516c8.556,0,15.516-6.96,15.516-15.516C127.225,351.653,120.265,344.693,111.709,344.693z" />
                                                            </g>
                                                        </g>
                                                        <g>
                                                            <g>
                                                                <path d="M432.355,344.693c-8.556,0-15.516,6.96-15.516,15.516c0,8.556,6.96,15.516,15.516,15.516c8.556,0,15.516-6.96,15.516-15.516C447.871,351.653,440.911,344.693,432.355,344.693z" />
                                                            </g>
                                                        </g>
                                                        <g>
                                                            <g>
                                                                <path d="M495.909,245.23l-57.744-19.248l-26.989-74.218c-3.369-9.265-12.256-15.49-22.115-15.49h-69.448v-16.549c0-8.556-6.96-15.516-15.516-15.516H15.516C6.96,104.209,0,111.17,0,119.726v216.436c0,8.556,6.96,15.516,15.516,15.516H64.91c-0.504,2.77-0.781,5.619-0.781,8.532c0,26.236,21.345,47.581,47.581,47.581s47.581-21.345,47.581-47.581c0-2.914-0.277-5.762-0.781-8.532h227.047c-0.504,2.77-0.781,5.619-0.781,8.532c0,26.236,21.345,47.581,47.581,47.581c26.236,0,47.581-21.345,47.581-47.581c0-3.706-0.44-7.31-1.245-10.774l15.871-7.935C505.318,336.122,512,325.309,512,313.282v-45.727C512,257.411,505.534,248.439,495.909,245.23z M15,119.726c0-0.285,0.231-0.517,0.516-0.517h288.581c0.285,0,0.516,0.231,0.516,0.516v160.839H15V119.726z M111.709,392.791c-17.965,0-32.581-14.616-32.581-32.581c0-17.965,14.616-32.581,32.581-32.581c17.965,0,32.581,14.616,32.581,32.581C144.291,378.175,129.675,392.791,111.709,392.791z M304.613,336.677H153.038c-8.203-14.349-23.65-24.048-41.329-24.048c-17.679,0-33.125,9.699-41.328,24.048H15.516c-0.285,0-0.516-0.231-0.516-0.516v-40.597h289.613V336.677z M406.698,183.339l14.95,41.113h-16.104l-14.95-41.113H406.698z M319.613,151.274h69.448c3.575,0,6.797,2.257,8.019,5.616l4.163,11.448h-81.63V151.274z M319.613,183.339h55.02l14.95,41.113h-69.97V183.339z M432.355,392.791c-17.965,0-32.581-14.616-32.581-32.581c0-17.965,14.616-32.581,32.581-32.581c17.965,0,32.581,14.616,32.581,32.581C464.936,378.175,450.32,392.791,432.355,392.791z M497,280.563h-8.532c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5H497v17.718c0,6.31-3.505,11.981-9.147,14.803l-14.847,7.423c-8.36-13.707-23.454-22.878-40.651-22.878c-17.679,0-33.125,9.699-41.328,24.048h-71.414v-41.113h136.791c4.142,0,7.5-3.358,7.5-7.5c0-4.142-3.358-7.5-7.5-7.5H319.613v-41.113h111.525l60.028,20.009c3.49,1.163,5.834,4.416,5.834,8.094V280.563z" />
                                                            </g>
                                                        </g>
                                                        <g>
                                                            <g>
                                                                <path
                                                                    className="fill-primary"
                                                                    d="M251.705,193.375l-56.113-32.064c-3.595-2.055-8.177-0.805-10.233,2.791c-2.055,3.597-0.806,8.178,2.791,10.233l31.592,18.053H71.629c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.499,7.5,7.499h148.113L188.15,225.44c-3.596,2.055-4.846,6.636-2.791,10.233c1.384,2.422,3.915,3.78,6.519,3.78c1.262,0,2.541-0.319,3.714-0.99l56.113-32.064c2.336-1.335,3.779-3.82,3.779-6.512C255.484,197.195,254.042,194.711,251.705,193.375z"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </div>
                                                <div className="status text-xs leading-tight">
                                                    <span className="text-muted-foreground block">
                                                        Order
                                                    </span>
                                                    <span className="text-foreground font-semibold block">
                                                        Shipped
                                                    </span>
                                                </div>
                                            </li>

                                            <li className="order-status__status-info__step flex flex-col items-center text-center flex-1">
                                                <div className="icon w-6 h-6 text-success-600">
                                                    {/* Delivered Icon */}
                                                    <svg
                                                        version="1.1"
                                                        id="Capa_1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        x="0px"
                                                        y="0px"
                                                        width="100%"
                                                        viewBox="0 0 512 512"
                                                        // style={{ enableBackground: 'new 0 0 512 512' }}
                                                        style={{ width: "24px", height: "24px" }}
                                                        xmlSpace="preserve"
                                                    >
                                                        <g>
                                                            <g>
                                                                <path
                                                                    d="M488.468,448.903h-8.532V226.4C499.202,214.003,512,192.386,512,167.822c0-1.305-0.341-2.588-0.988-3.721L451.499,59.953
          c-4.18-7.313-12.009-11.857-20.432-11.857H80.933c-8.423,0-16.252,4.543-20.432,11.857L0.988,164.101
          C0.341,165.234,0,166.518,0,167.822c0,24.564,12.798,46.181,32.064,58.578v222.503h-8.532c-4.142,0-7.5,3.358-7.5,7.5
          c0,4.142,3.358,7.5,7.5,7.5h464.936c4.143,0,7.5-3.358,7.5-7.5C495.968,452.261,492.61,448.903,488.468,448.903z 
          M15.517,175.322h24.044c4.142,0,7.5-3.358,7.5-7.5c0-4.142-3.358-7.5-7.5-7.5H20.424l53.101-92.927
          c1.516-2.652,4.354-4.299,7.408-4.299h350.134c3.054,0,5.893,1.647,7.408,4.299l53.1,92.927h-19.141
          c-4.143,0-7.5,3.358-7.5,7.5c0,4.142,3.357,7.5,7.5,7.5h24.048c-3.667,26.584-26.532,47.125-54.108,47.125
          c-27.575,0-50.429-20.543-54.097-47.125h52.096c4.143,0,7.5-3.358,7.5-7.5c0-4.142-3.357-7.5-7.5-7.5H71.631
          c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h52.091c-3.668,26.582-26.523,47.125-54.097,47.125
          C42.049,222.447,19.184,201.906,15.517,175.322z M372.222,175.322c-3.668,26.582-26.523,47.125-54.097,47.125
          c-27.575,0-50.429-20.543-54.097-47.125H372.222z M247.972,175.322c-3.668,26.582-26.523,47.125-54.097,47.125
          c-27.574,0-50.429-20.543-54.097-47.125H247.972z M424.854,448.904h-81.193v-25.081h81.193V448.904z M424.854,408.823
          h-81.193V271.516h81.193V408.823z M464.936,448.904h-25.081V264.016c0-4.142-3.357-7.5-7.5-7.5h-96.193c-4.143,0-7.5,3.358-7.5,7.5
          v184.887H47.064V233.674c7.081,2.433,14.665,3.773,22.561,3.773c27.095,0,50.624-15.556,62.125-38.207
          c11.501,22.65,35.03,38.207,62.125,38.207c27.095,0,50.624-15.556,62.125-38.207c11.501,22.65,35.03,38.207,62.125,38.207
          c27.095,0,50.624-15.556,62.125-38.207c11.501,22.65,35.03,38.207,62.125,38.207c7.896,0,15.48-1.34,22.561-3.772V448.904z"
                                                                />
                                                            </g>
                                                        </g>
                                                        <g>
                                                            <g>
                                                                <path
                                                                    className="accented"
                                                                    d="M296.081,256.516H79.645c-4.142,0-7.5,3.358-7.5,7.5v152.307c0,4.142,3.358,7.5,7.5,7.5h216.436
            c4.143,0,7.5-3.358,7.5-7.5V264.016C303.581,259.873,300.224,256.516,296.081,256.516z M288.581,408.823H87.145V271.516h201.436
            V408.823z"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </div>
                                                <div className="status text-xs leading-tight">
                                                    <span className="text-muted-foreground block">
                                                        Order
                                                    </span>
                                                    <span className="text-foreground font-semibold block">
                                                        Delivered
                                                    </span>
                                                </div>
                                            </li>
                                        </ol>
                                    </section>
                                </article>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Update Status</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="order-status-select" className="form-label">
                                            Change order status
                                        </label>
                                        <select
                                            id="order-status-select"
                                            className="form-select"
                                            disabled={["Returned", "Cancelled"].includes(orderStatus)}
                                            value={orderStatus}
                                            onChange={(e) => setOrderStatus(e.target.value)}
                                        >
                                            {[
                                                "pending",
                                                "packed",
                                                "shipped",
                                                "delivered",
                                                "return-initiated",
                                                "cancelled",
                                            ]
                                                .filter((status) => {
                                                    if (orderStatus === "pending") return true;
                                                    if (orderStatus === "packed")
                                                        return status !== "pending";
                                                    if (orderStatus === "shipped")
                                                        return !["pending", "packed"].includes(status);
                                                    if (orderStatus === "delivered")
                                                        return ![
                                                            "pending",
                                                            "packed",
                                                            "shipped",
                                                        ].includes(status);
                                                    return true;
                                                })
                                                .map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="payment-status-select"
                                            className="form-label"
                                        >
                                            Change payment status
                                        </label>
                                        <select
                                            id="payment-status-select"
                                            className="form-select"
                                            value={paymentStatus}
                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                            disabled
                                        >
                                            <option value="Paid">Paid</option>
                                            <option value="Pending">Unpaid</option>
                                        </select>
                                    </div>

                                    <div>
                                        <button type="submit" className="btn btn-primary w-md">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-16">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                {/* Invoice Header */}
                                <div className="invoice-title">
                                    <div className="d-flex flex-column align-items-end text-end">
                                        <h5 className="mb-2 font-size-11">
                                            Order No:{" "}
                                            <span className="fw-normal">{orderData.orderCode}</span>
                                        </h5>
                                        <h5 className="mb-2 font-size-11">
                                            Payment Method:{" "}
                                            <span className="fw-normal">{orderData.paymentMode}</span>
                                        </h5>
                                        {/* <h5 className="mb-0 font-size-11">
                      Payment Reference Number:{" "}
                      <span className="fw-normal">{orderData._id}</span>
                    </h5> */}
                                    </div>

                                    <div className="mb-4">
                                        <img
                                            src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/nalsuvai-logo-black.png"
                                            alt="logo"
                                            height="45"
                                            style={{ width: "10%" }}
                                        />
                                    </div>

                                    <div className="text-muted">
                                        <p className="mb-1">
                                            102, Avinashi Road, Peelamedu, Coimbatore – 641004
                                        </p>
                                        <p className="mb-1">
                                            <i className="mdi mdi-email-outline me-1" />{" "}
                                            nalsuvai@gmail.com
                                        </p>
                                        <p>
                                            <i className="mdi mdi-phone-outline me-1" /> +91 811650
                                            2323
                                        </p>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {/* Billing, Shipping, Status */}
                                <div className="row " style={{ marginTop: "20px" }}>
                                    {orderData.shippingAddress && (
                                        <div className="col-sm-4 text-muted">
                                            <h5 className="font-size-16 mb-3">Billing Address:</h5>
                                            <h5 className="font-size-15 mb-2">
                                                {orderData.userName}
                                            </h5>
                                            <p className="mb-1">
                                                {orderData.shippingAddress.contactName}
                                            </p>
                                            <p>{orderData.shippingAddress.contactNumber}</p>
                                            <p className="mb-1">
                                                {orderData.shippingAddress.street},{" "}
                                                {orderData.shippingAddress.city}
                                            </p>
                                            <p className="mb-1">
                                                {orderData.shippingAddress.state},{" "}
                                                {orderData.shippingAddress.postalCode},{" "}
                                                {orderData.shippingAddress.country}
                                            </p>

                                        </div>
                                    )}
                                    {orderData.shippingAddress && (
                                        <div className="col-sm-4 text-muted">
                                            <h5 className="font-size-16 mb-3">Shipping Address:</h5>
                                            <p className="mb-1">
                                                {orderData.shippingAddress.contactName}
                                            </p>
                                            <p>{orderData.shippingAddress.contactNumber}</p>
                                            <p className="mb-1">
                                                {orderData.shippingAddress.street},{" "}
                                                {orderData.shippingAddress.city}
                                            </p>
                                            <p className="mb-1">
                                                {orderData.shippingAddress.state},{" "}
                                                {orderData.shippingAddress.postalCode},{" "}
                                                {orderData.shippingAddress.country}
                                            </p>

                                        </div>
                                    )}

                                    <div className="col-sm-4 text-muted text-sm-end">
                                        <div className="mt-0">
                                            <h5 className="font-size-15 mb-1">Order Date:</h5>
                                            <p>{formatDate(orderData.createdAt)}</p>
                                        </div>
                                        <div className="mt-3">
                                            <h5 className="font-size-15 mb-1">Order Status:</h5>
                                            <span
                                                className={`badge ${orderData.status === "delivered"
                                                    ? "bg-success"
                                                    : "bg-warning"
                                                    } font-size-12 ms-2`}
                                            >
                                                {orderData.status.charAt(0).toUpperCase() +
                                                    orderData.status.slice(1)}
                                            </span>
                                        </div>
                                        {/* <div className="mt-3">
                      <h5 className="font-size-15 mb-1">
                        Estimated Delivery Date:
                      </h5>
                      <p>14 Oct, 2020</p>
                    </div> */}
                                        <div className="mt-3">
                                            <h5 className="font-size-15 mb-1">Payment Status:</h5>
                                            <span
                                                className={`badge ${paymentStatus === "paid" ? "bg-success" : "bg-danger"
                                                    } font-size-12 ms-2`}
                                            >
                                                {paymentStatus.charAt(0).toUpperCase() +
                                                    paymentStatus.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="py-2">
                                    <h5 className="font-size-15 mb-3">Order Summary</h5>
                                    <div className="table-responsives">
                                        <table className="table align-middle table-nowrap table-centered mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="fw-bold" style={{ width: "70px" }}>
                                                        No.
                                                    </th>
                                                    <th className="fw-bold">Item</th>
                                                    <th className="fw-bold">Price</th>
                                                    <th className="fw-bold">Quantity</th>
                                                    <th
                                                        className="text-end fw-bold"
                                                        style={{ width: "120px" }}
                                                    >
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderData.products.map((product, index) => (
                                                    <tr key={product._id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>
                                                            <h5 className="font-size-14 mb-1">
                                                                {product.productName}
                                                            </h5>
                                                            <p className="text-muted mb-0">
                                                                {product.attributeData.map(attr => (
                                                                    <span key={attr._id} className="attribute">
                                                                        {attr.name}: {attr.value[0].value}
                                                                    </span>
                                                                ))}
                                                            </p>
                                                            {/* <p className="text-muted mb-0">
                                Vendor: {product.brand}
                              </p> */}
                                                        </td>
                                                        <td>₹ {product.unitPrice.toFixed(2)}</td>
                                                        <td>{product.quantity}</td>
                                                        <td className="text-end">
                                                            ₹{" "}
                                                            {(product.unitPrice * product.quantity).toFixed(
                                                                2
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <th colSpan="4" className="text-end fw-bold">
                                                        Sub Total
                                                    </th>
                                                    <td className="text-end">
                                                        ₹ {orderData.subTotal.toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="5">
                                                        <div className="col-lg-4 ms-auto mt-4">
                                                            <div className="rounded p-3">
                                                                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                    <span className="fw-bold">Tax:</span>
                                                                    <span>
                                                                        ₹ {orderData.customerTotalTax.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                    <span className="fw-bold">
                                                                        Shipping Charge:
                                                                    </span>
                                                                    <span>₹ {orderData.deliveryCharge.toFixed(2)}</span>
                                                                </div>
                                                                <div className="d-flex justify-content-between pt-2">
                                                                    <span className="fw-bold fs-5">Total:</span>
                                                                    <span className="fw-semibold fs-5 text-success">
                                                                        ₹ {(orderData.total)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Buttons */}
                                    <div className="d-print-none mt-4">
                                        <div className="float-end">
                                            <button
                                                className="btn btn-success me-2"
                                                onClick={() => window.print()}
                                            >
                                                <i className="fa fa-print me-1"></i> Print
                                            </button>
                                            <button className="btn btn-primary">
                                                <i className="fa fa-download me-1"></i> Download Invoice
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrdersInvoiceDetailPosLayer;
