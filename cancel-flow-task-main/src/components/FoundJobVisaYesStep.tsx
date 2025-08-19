'use client';

import React, { useState } from 'react';
import { Button, ModalHeader, ModalBody, FormField, TextInput } from './ui';

type FoundJobVisaYesStepProps = {
	onBack: () => void;
	onComplete: (payload: { hasCompanyLawyer: boolean; visa: string; foundWithMate: '' | 'Yes' | 'No' }) => void;
	onClose: () => void;
	imageUrl?: string;
	foundJobData?: { foundWithMate: '' | 'Yes' | 'No' };
};

export default function FoundJobVisaYesStep({
	onBack,
	onComplete,
	onClose,
	imageUrl = '/nyc.jpg',
	foundJobData,
}: FoundJobVisaYesStepProps) {
	const [answer, setAnswer] = useState<'' | 'yes' | 'no'>('');
	const [visa, setVisa] = useState('');
	const [touched, setTouched] = useState(false);

	const visaValid = answer === 'no' ? true : visa.trim().length > 0;
	const canSubmit = !!answer && (answer === 'no' || visaValid);

	const submit = () => {
		if (!canSubmit) {
			setTouched(true);
			return;
		}
		
		if (answer === 'yes') {
			// If yes company lawyer, route to milaho page
			onComplete({ 
				hasCompanyLawyer: false, 
				visa: 'milaho',
				foundWithMate: foundJobData?.foundWithMate || 'Yes'
			});
		} else {
			// If no company lawyer, collect visa info
			onComplete({ 
				hasCompanyLawyer: true, 
				visa: visa.trim(),
				foundWithMate: foundJobData?.foundWithMate || 'Yes'
			});
		}
	};

	return (
		<div className="modal-panel">
			{/* Header: responsive layout - mobile: title+progress left, desktop: original layout */}
			<ModalHeader onClose={onClose}>
				<div className="flex items-center w-full">
					{/* Mobile: title and progress stacked on left */}
					<div className="flex flex-col gap-2 sm:hidden">
						<div className="section-title text-left">Subscription Cancellation</div>
						<div className="flex items-center gap-2">
							<div className="flex gap-1">
								<div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
								<div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
								<div className="w-4 h-1.5 bg-green-500 rounded-full"></div>
							</div>
							<div className="text-xs text-gray-600">Step 3 of 3</div>
						</div>
					</div>

					{/* Desktop: original layout with back button in header */}
					<div className="hidden sm:flex items-center w-full">
						<button
							onClick={onBack}
							className="back-link"
							aria-label="Go back"
						>
							<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							Back
						</button>
						
						<div className="flex items-center gap-3 mx-auto">
							<div className="section-title">Subscription Cancellation</div>
							<div className="flex items-center gap-2">
								<span className="step-text">Step 3 of 3</span>
								<div className="flex gap-1">
									<div className="progress-pill--step"></div>
									<div className="progress-pill--step"></div>
									<div className="progress-pill--step"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ModalHeader>

			{/* Mobile: Back button below header */}
			<div className="sm:hidden px-6 py-3 border-b border-gray-100">
				<button
					onClick={onBack}
					className="back-link flex items-center gap-2"
					aria-label="Go back"
				>
					<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					<span className="text-sm font-medium">Back</span>
				</button>
			</div>

			{/* Body */}
			<ModalBody>
				<div className="content-grid">
					{/* Left column */}
					<div className="sm:pr-6">
						<h1 className="heading-1">
							You landed the job!
							<br />
							<span className="italic">That&apos;s what we live for.</span>
						</h1>

						<p className="text-body text-muted">
							Even if it wasn&apos;t through Migrate Mate,
							<br /> let us help get your visa sorted.
						</p>

						<div className="section section--large">
							<div className="section--compact">
								<p className="visa-question-text">
									Is your company providing an immigration lawyer to help with your visa?
								</p>

								<div className="checkbox-group">
									<label className="checkbox-item">
										<input
											type="radio"
											name="visa-lawyer"
											className="checkbox-input"
											checked={answer === 'yes'}
											onChange={() => setAnswer('yes')}
										/>
										<span className="checkbox-label">Yes</span>
									</label>

									<label className="checkbox-item">
										<input
											type="radio"
											name="visa-lawyer"
											className="checkbox-input"
											checked={answer === 'no'}
											onChange={() => setAnswer('no')}
										/>
										<span className="checkbox-label">No</span>
									</label>
								</div>

								{answer !== '' && (
									<div className="section--small mt-4">
										{answer === 'no' ? (
											<>
												<p className="text-muted">
													We can connect you with one of our trusted partners.
												</p>
												<FormField label="Which visa would you like to apply for?" required>
													<TextInput
														value={visa}
														onChange={(e) => setVisa(e.target.value)}
														onBlur={() => setTouched(true)}
														placeholder="e.g., H-1B, O-1, Green Card"
														error={touched && !visaValid ? 'Please enter a visa type.' : undefined}
													/>
												</FormField>
											</>
										) : (
											<FormField label="What visa will you be applying for?" required>
												<TextInput
													value={visa}
													onChange={(e) => setVisa(e.target.value)}
													onBlur={() => setTouched(true)}
													placeholder="e.g., H-1B, O-1, Green Card"
													error={touched && !visaValid ? 'Please enter a visa type.' : undefined}
												/>
											</FormField>
										)}
									</div>
								)}
							</div>
						</div>

						<div className="section mt-6">
							<Button
								disabled={!canSubmit}
								onClick={submit}
								variant="primary"
								fullWidth
								size="lg"
								className="btn--gray"
							>
								Complete cancellation
							</Button>
						</div>
					</div>

					{/* Right image - Desktop only */}
					<div className="hidden sm:block image-container">
						<img
							src={imageUrl}
							alt="NYC skyline"
							className="h-full w-full object-cover"
						/>
					</div>
				</div>
			</ModalBody>
		</div>
	);
}
