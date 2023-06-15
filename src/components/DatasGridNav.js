import React, { useState } from 'react';
import Modal from 'react-modal';
import { SearchIcon, FilterIcon, CloseIcon } from "../svgs/SvgIcons"

/**
 * DataGridNav component.
 *
 * @param {function} addData - The function to add new data row.
 * @param {function} onSearch - The function to handle search event.
 * @returns {JSX.Element} The DataGridNav component.
 */
const DatasGridNav = ({ addData, onSearch }) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [socialMediaLink, setSocialMediaLink] = useState('');
    const [socialMediaName, setSocialMediaName] = useState('');
    const [explanation, setExplanation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Opens the modal.
     */
    const openModal = () => {
        setIsOpen(true);
    };

    /**
     * Closes the modal and resets the input values.
     */
    const closeModal = () => {
        setIsOpen(false);
        setSocialMediaLink('');
        setSocialMediaName('');
        setExplanation('');
    };

    /**
     * Handles the save event.
     */
    const handleSave = () => {
        const newRow = {
            socialmedialink: socialMediaLink,
            socialmedianame: socialMediaName,
            explanation: explanation,
        };
        addData(newRow);
        closeModal();
    };

    /**
     * Handles the search event.
     *
     * @param {object} e - The event object.
     */
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    // Check if any of the input values are empty
    const isSaveDisabled = socialMediaLink === '' || socialMediaName === '' || explanation === '';

    return (
        <div className="datagrid__nav">
            <div className="datagrid__search">
                <div className="datagrid__search__bar">
                    <input
                        className="datagrid__search__input"
                        placeholder="Search objects..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <div className="datagrid__search__button">
                        <SearchIcon />
                    </div>
                </div>
                <div className="datagrid__filter">
                    <FilterIcon />
                </div>
            </div>
            <button className="add__account" onClick={openModal}>
                <span>+</span>
                <span>Yeni Hesap Ekle</span>
            </button>
            <Modal isOpen={modalIsOpen} className="add__account__modal">
                <CloseIcon onClick={closeModal} />
                <div className="add__account__modal__input">
                    <label htmlFor="link">Sosyal Medya Linki</label>
                    <input
                        type="text"
                        value={socialMediaLink}
                        onChange={(e) => setSocialMediaLink(e.target.value)}
                    />
                </div>
                <div className="add__account__modal__input">
                    <label htmlFor="username">Sosyal Medya Adı</label>
                    <input
                        type="text"
                        value={socialMediaName}
                        onChange={(e) => setSocialMediaName(e.target.value)}
                    />
                </div>
                <div className="add__account__modal__input">
                    <label>Açıklama</label>
                    <input
                        type="text"
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                    />
                </div>
                <div className="add__account__modal__buttons">
                    <button onClick={closeModal}>Vazgeç</button>
                    <button onClick={handleSave} disabled={isSaveDisabled}>
                        Kaydet
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default DatasGridNav;
