import React from "react";
import { PeopleSearchItem } from "./index";

const PeopleTabResults = (props) => {

    const { people } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(people).map((p) => {
                    return <PeopleSearchItem key={p.id} user={p.data}/>
                })
            }
        </ul>
    );
};

export default PeopleTabResults;